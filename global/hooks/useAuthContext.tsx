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
import refreshJwt from 'global/utils/refreshJwt';

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
  cancelFetchWithAuth: () => { },
  token: '',
  isLoading: false,
  logout: () => { },
  user: undefined,
  fetchWithAuth: () => { },
  permissions: [],
});

const removeToken = () => {
  typeof window !== 'undefined' && localStorage.removeItem(EGO_JWT_KEY);
};

// const setToken = (token: string) => {
//   typeof window !== 'undefined' &&
//     localStorage.setItem(EGO_JWT_KEY, token);
// };

const getToken = (): string | null => {
  return typeof window === 'undefined' ? null : localStorage.getItem(EGO_JWT_KEY);
};

export const AuthProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const { NEXT_PUBLIC_DAC_API_ROOT } = getConfig();
  const router = useRouter();

  const logout = () => {
    router.push('/?session_expired=true');
    removeToken();
  };

  // TODO: decide if we want these for all types of requests or only POST
  axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

  const cancelTokenSource = axios.CancelToken.source();
  const cancelFetchWithAuth = cancelTokenSource.cancel;
  const fetchWithAuth = async ({
    data,
    headers = {},
    method = 'GET' as Method,
    params = {},
    responseType,
    url,
  }: AxiosRequestConfig) => {
    setLoading(true);

    const cancelFetch = () => {
      setLoading(false);
      return Promise.reject(undefined);
    }

    const egoJwt = getToken() || '';
    (!url || !egoJwt) && cancelFetch();
    !egoJwt && logout();

    const config: AxiosRequestConfig = {
      ...(!['DELETE', 'GET'].includes(method) && { data }),
      baseURL: NEXT_PUBLIC_DAC_API_ROOT,
      cancelToken: cancelTokenSource.token,
      headers: {
        accept: '*/*',
        ...headers,
        Authorization: `Bearer ${egoJwt || ''}`,
      },
      method,
      params,
      ...(responseType ? { responseType } : {}),
      url,
    };

    if (egoJwt && !isValidJwt(egoJwt)) {
      const newJwt = (await refreshJwt()) as string;
      if (isValidJwt(newJwt)) {
        return axios({
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${newJwt || ''}`,
          }
        })
          .catch((error) => {
            // TODO: log errors somewhere not visible to the user?
            // Leaving this log here pre-release, for troubleshooting
            console.error('Error in fetchWithAuth', { error });
            throw { error };
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        cancelFetch();
        logout();
      }
    } else if (egoJwt) {
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
    }
  };

  // get the latest token
  const token = getToken() || undefined;
  const userInfo = token && isValidJwt(token) ? decodeToken(token) : null;
  const user = userInfo ? extractUser(userInfo) : undefined;
  const permissions = getPermissionsFromToken(token || '');

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
