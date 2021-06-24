import React, { createContext, useState } from 'react';
import { useRouter } from 'next/router';
import urlJoin from 'url-join';
import { EGO_JWT_KEY } from '../constants';
import {
  decodeToken,
  extractUser,
  getPermissionsFromToken,
  isValidJwt,
} from '../utils/egoTokenUtils';
import { UserWithId } from '../types';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { getConfig } from 'global/config';
import { DAC_API } from 'global/constants/externalPaths';

type T_AuthContext = {
  token?: string;
  logout: () => void;
  user?: UserWithId;
  fetchWithAuth: any;
  permissions: string[];
};

const AuthContext = createContext<T_AuthContext>({
  token: undefined,
  logout: () => {},
  user: undefined,
  fetchWithAuth: () => {},
  permissions: [],
});

export const AuthProvider = ({
  egoJwt,
  children,
}: {
  egoJwt?: string;
  children: React.ReactElement;
}) => {
  const router = useRouter();
  // TODO: typing this state as `string` causes a compiler error. the same setup exists in argo but does not cause
  // a type issue. using `any` for now
  const [token, setTokenState] = useState<any>(egoJwt);
  const removeToken = () => {
    localStorage.removeItem(EGO_JWT_KEY);
    setTokenState(null);
  };

  const logout = () => {
    removeToken();
    router.push('/');
  };

  if (!token) {
    if (isValidJwt(egoJwt)) {
      setTokenState(egoJwt);
    }
  } else {
    if (!isValidJwt(token)) {
      if (egoJwt && token === egoJwt) {
        removeToken();
      }
    } else if (!egoJwt) {
      setTokenState(null);
    }
  }

  const { USE_DAC_API_PROXY } = getConfig();

  // TODO: decide if we want these for all types of requests or only POST
  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

  const fetchWithAuth = ({
    params = {},
    headers = {},
    method = 'GET' as Method,
    url,
  }: AxiosRequestConfig) => {
    if (!url) {
      console.warn('no URL provided to fetchWithAuth');
      return Promise.resolve(undefined);
    }

    const config: AxiosRequestConfig = {
      baseURL: USE_DAC_API_PROXY ? '' : DAC_API,
      params,
      headers: {
        accept: '*/*',
        ...headers,
        Authorization: `Bearer ${token || ''}`,
      },
      method,
      url: USE_DAC_API_PROXY ? urlJoin('/api', url) : url,
    };

    return (
      axios(config)
        // TODO log errors somewhere?
        .catch((error) => {
          console.error({ error });
        })
    );
  };

  const userInfo = token ? decodeToken(token) : null;
  const user = userInfo ? extractUser(userInfo) : undefined;
  const permissions = getPermissionsFromToken(token);

  const authData = {
    token,
    logout,
    user,
    fetchWithAuth,
    permissions,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default function useAuthContext() {
  return React.useContext(AuthContext);
}
