/*
 * Copyright (c) 2021 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

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
  queue,
}: {
  queue: any;
  children: React.ReactElement;
}) => {
  console.log('▶️ start AuthProvider')
  // TODO: typing this state as `string` causes a compiler error. the same setup exists in argo but does not cause
  // a type issue. using `any` for now
  const egoJwt = typeof window !== 'undefined' && localStorage.getItem(EGO_JWT_KEY) || '';
  const [isLoading, setLoading] = useState<boolean>(true);
  const [token, setTokenState] = useState<string>(egoJwt);
  const [isLoadingRefreshToken, setLoadingRefreshToken] = useState<boolean>(false);
  const { NEXT_PUBLIC_DAC_API_ROOT } = getConfig();
  const router = useRouter();

  const removeToken = () => {
    localStorage.removeItem(EGO_JWT_KEY);
    setTokenState('');
  };

  const logout = () => {
    console.log('💀 logout')
    router.push('/?session_expired=true');
    removeToken();
  };

  if (!isLoadingRefreshToken) {
    if (token) {
      console.log('🎫 token exists', token.slice(-5));
      if (!isValidJwt(token)) {
        if (egoJwt && token === egoJwt) {
          console.log('🌀 get refresh token');
          console.log('⏸ queue', queue)
          setLoadingRefreshToken(true);
          setLoading(true);
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
                  console.log('✅ refresh token valid', refreshedJwt.slice(-5))
                  setTokenState(refreshedJwt);
                  localStorage.setItem(EGO_JWT_KEY, refreshedJwt);
                } else {
                  console.log('❌ refresh token & token state invalid', refreshedJwt)
                  logout();
                }
              })
              .catch((err) => {
                console.log('❌ refresh token error', err)
                logout();
              })
              .finally(() => {
                setLoadingRefreshToken(false);
              })
          );
        }
      } else if (!egoJwt) {
        setTokenState('');
      }
    } else if (isValidJwt(egoJwt)) {
      setTokenState(egoJwt);
    }
  } else {
    console.log('⏳ refresh token loading')
  }

  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

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

    return axios(config)
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

  const userInfo = token && !isLoadingRefreshToken && isValidJwt(token)
    ? decodeToken(token)
    : null;
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
