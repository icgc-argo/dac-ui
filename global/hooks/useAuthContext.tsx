import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';
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

type T_AuthContext = {
  cancelFetchWithAuth: Canceler;
  fetchWithAuth: any;
  isLoading: boolean;
  logout: () => void;
  permissions: string[];
  token?: string;
  user?: UserWithId | void;
};

const AuthContext = createContext<T_AuthContext>({
  cancelFetchWithAuth: () => {},
  token: '',
  isLoading: false,
  logout: () => {},
  user: undefined,
  fetchWithAuth: () => {},
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
    localStorage.removeItem(EGO_JWT_KEY);
    setTokenState('');
  };

  const logout = () => {
    removeToken();
    router.push('/');
  };

  if (token) {
    if (!isValidJwt(token)) {
      if (egoJwt && token === egoJwt) {
        removeToken();
      }
    } else if (!egoJwt) {
      setTokenState('');
    }
  } else if (isValidJwt(egoJwt)) {
    setTokenState(egoJwt);
  }

  // TODO: decide if we want these for all types of requests or only POST
  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

  const cancelTokenSource = axios.CancelToken.source();
  const cancelFetchWithAuth = cancelTokenSource.cancel;
  const fetchWithAuth = ({
    params = {},
    headers = {},
    method = 'GET' as Method,
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
      baseURL: NEXT_PUBLIC_DAC_API_ROOT,
      cancelToken: cancelTokenSource.token,
      headers: {
        accept: '*/*',
        ...headers,
        Authorization: `Bearer ${token || ''}`,
      },
      method,
      params,
      url,
    };

    return axios(config)
      .catch((error) => {
        // TODO log errors somewhere?
        console.error({ error });
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
