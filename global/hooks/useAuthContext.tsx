import React, { createContext, useState } from 'react';
import { useRouter } from 'next/router';

import { EGO_JWT_KEY } from '../constants/auth';
import {
  decodeToken,
  extractUser,
  getPermissionsFromToken,
  isValidJwt,
} from '../utils/egoTokenUtils';
import { UserWithId } from '../types';

type T_AuthContext = {
  token?: string;
  logout: () => void;
  user?: UserWithId;
  fetchWithAuth: typeof fetch;
  permissions: string[];
};

const AuthContext = createContext<T_AuthContext>({
  token: undefined,
  logout: () => {},
  user: undefined,
  fetchWithAuth: fetch,
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

  const fetchWithAuth: T_AuthContext['fetchWithAuth'] = (url, options) => {
    return fetch(url, {
      ...options,
      headers: { ...options?.headers, accept: '*/*', Authorization: `Bearer ${token || ''}` },
      body: null,
    });
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
