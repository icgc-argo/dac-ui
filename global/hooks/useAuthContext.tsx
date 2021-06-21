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

type T_AuthContext = {
  loadingAuth: boolean;
  token: string;
  logout: () => void;
  user: UserWithId | undefined;
  fetchWithAuth: any;
  permissions: string[];
};

const AuthContext = createContext<T_AuthContext>({
  loadingAuth: true,
  token: '',
  logout: () => {},
  user: undefined,
  fetchWithAuth: () => {},
  permissions: [],
});

export const AuthProvider = ({
  egoJwt = '',
  children,
}: {
  egoJwt?: string;
  children: React.ReactElement;
}) => {
  // TODO: typing this state as `string` causes a compiler error. the same setup exists in argo but does not cause
  // a type issue. using `any` for now
  const [token, setTokenState] = useState<any>(egoJwt);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const { NEXT_PUBLIC_DAC_API_ROOT } = getConfig();
  const router = useRouter();

  const removeToken = () => {
    localStorage.removeItem(EGO_JWT_KEY);
    setTokenState(null);
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
      setTokenState(null);
    }
  } else if (isValidJwt(egoJwt)) {
    setTokenState(egoJwt);
  }

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
      baseURL: NEXT_PUBLIC_DAC_API_ROOT,
      params,
      headers: {
        accept: '*/*',
        ...headers,
        Authorization: `Bearer ${token || ''}`,
      },
      method,
      url,
    };

    return axios(config).catch((error) => {
      // TODO log errors somewhere?
      console.error({ error });
    });
  };

  const userInfo = token ? decodeToken(token) : null;
  const user = userInfo ? extractUser(userInfo) : undefined;
  const permissions = getPermissionsFromToken(token);

  loadingAuth && token && user && setLoadingAuth(false);

  const authData = {
    loadingAuth,
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
