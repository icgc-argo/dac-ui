import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Queue from 'promise-queue';
import urlJoin from 'url-join';
import { EGO_JWT_KEY } from '../constants';
import {
  decodeToken,
  extractUser,
  getPermissionsFromToken,
  isValidJwt,
} from '../utils/egoTokenUtils';
import { UserWithId } from '../types';
import axios, { AxiosRequestConfig, Canceler, Method } from 'axios';
import { getConfig } from 'global/config';

const { NEXT_PUBLIC_EGO_API_ROOT, NEXT_PUBLIC_EGO_CLIENT_ID } = getConfig();

type T_AuthContext = {
  cancelFetchWithAuth: Canceler;
  fetchWithAuth: any;
  isLoading: boolean;
  logout: () => void;
  permissions: string[];
  token?: string;
  user?: UserWithId | void;
};

const axiosInstance = axios.create({
  headers: {
    post: {
      ['Content-Type']: 'application/json;charset=utf-8',
      ['Access-Control-Allow-Origin']: '*'
    }
  }
});

var maxConcurrent = 1;
var maxQueue = Infinity;
var queue = new Queue(maxConcurrent, maxQueue);
const refreshUrl = urlJoin(
  NEXT_PUBLIC_EGO_API_ROOT,
  `/oauth/refresh?client_id=${NEXT_PUBLIC_EGO_CLIENT_ID}`
);

const AuthContext = createContext<T_AuthContext>({
  cancelFetchWithAuth: () => { },
  token: '',
  isLoading: false,
  logout: () => { },
  user: undefined,
  fetchWithAuth: () => { },
  permissions: [],
});

export const AuthProvider = ({
  children,
  egoJwt = '',
}: {
  children: React.ReactElement;
  egoJwt: string;
}) => {
  // TODO: typing this state as `string` causes a compiler error. the same setup exists in argo but does not cause
  // a type issue. using `any` for now
  const [isLoading, setLoading] = useState<boolean>(true);
  const [token, setTokenState] = useState<string>(egoJwt);
  const { NEXT_PUBLIC_DAC_API_ROOT } = getConfig();
  const router = useRouter();

  const removeToken = () => {
    console.log('☠️ fetch - logout');
    localStorage.removeItem(EGO_JWT_KEY);
    setTokenState('');
  };

  const logout = () => {
    removeToken();
    router.push('/?session_expired=true');
  };

  // TODO refresh token here!
  console.log('🎫 fetch - egoJwt (prop):', egoJwt.slice(-10));
  console.log('🎫 fetch - token (state):', token.slice(-10));

  if (token) {
    if (!isValidJwt(token)) {
      if (egoJwt && token === egoJwt) {
        console.log('🌀 fetch - try to get refresh token:', token.slice(-10));
        queue.add(() =>
          fetch(refreshUrl, {
            credentials: 'include', // sends refreshId cookie
            headers: {
              accept: '*/*',
              authorization: `Bearer ${token}`,
            },
            method: 'POST',
          })
            .then(res => res.text())
            .then(refreshedJwt => {
              if (isValidJwt(refreshedJwt)) {
                console.log('🎉 fetch - refresh token IS valid:', refreshedJwt.slice(-10));
                setTokenState(refreshedJwt);
                localStorage.setItem(EGO_JWT_KEY, refreshedJwt);
              } else {
                console.log('💥 fetch - refresh token NOT valid:', refreshedJwt.slice(-10));
                logout();
              }
            })
            .catch((err) => {
              console.log('🧤 fetch - refresh token error:', err);
              logout();
            })
        );
      }
    } else if (!egoJwt) {
      setTokenState('');
    }
  } else if (isValidJwt(egoJwt)) {
    setTokenState(egoJwt);
  }

  if (token) {
    if (!isValidJwt(token)) {
      if (egoJwt && token === egoJwt) {
        logout();
      }
    } else if (!egoJwt) {
      setTokenState('');
    }
  } else if (isValidJwt(egoJwt)) {
    setTokenState(egoJwt);
  }

  const cancelTokenSource = axios.CancelToken.source();
  const cancelFetchWithAuth = cancelTokenSource.cancel;
  const fetchWithAuth = ({
    data,
    headers = {},
    method = 'GET' as Method,
    params = {},
    responseType,
    url,
  }: AxiosRequestConfig) => {
    setLoading(true);
    if (!url) {
      setLoading(false);
      return Promise.reject(undefined);
    }

    if (!token) {
      setLoading(false);
      return Promise.reject(undefined);
    }

    const config: AxiosRequestConfig = {
      ...(!['DELETE', 'GET'].includes(method) && { data }),
      baseURL: NEXT_PUBLIC_DAC_API_ROOT,
      cancelToken: cancelTokenSource.token,
      headers: {
        accept: '*/*',
        ...headers,
        Authorization: `Bearer ${token || ''}`,
      },
      method,
      params,
      ...(responseType ? { responseType } : {}),
      url,
    };

    return axiosInstance(config)
      .catch((error) => {
        // TODO: log errors somewhere not visible to the user?
        // Leaving this log here pre-release, for troubleshooting
        console.error('Error in fetchWithAuth', { error });
        throw { error };
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const userInfo = token ? decodeToken(token) : null;
  const user = userInfo ? extractUser(userInfo) : undefined;
  const permissions = getPermissionsFromToken(token);

  isLoading && token && user && setLoading(false);

  const authData = {
    cancelFetchWithAuth,
    fetchWithAuth,
    isLoading,
    logout,
    permissions,
    token,
    user,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
