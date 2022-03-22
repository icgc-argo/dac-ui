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
import { useToaster } from './useToaster';
import { TOAST_VARIANTS } from '@icgc-argo/uikit/notifications/Toast';
import refreshJwt from 'global/utils/auth/refreshJwt';
import deleteTokens from 'global/utils/auth/deleteTokens';

type T_AuthContext = {
  cancelFetchWithAuth: Canceler;
  fetchWithAuth: any;
  isLoading: boolean;
  logout: ({ manual }: { manual: boolean }) => void;
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
  const toaster = useToaster();

  const removeToken = () => {
    deleteTokens();
    setTokenState('');
  };

  const logout = ({ manual = false } = {}) => {
    console.log('LOGOUT manual?', manual);
    router.push(`/${manual ? '' : '?session_expired=true'}`);
    removeToken();
    router.reload();
  };

  if (token) {
    if (isValidJwt(token) && !egoJwt) {
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
  const fetchWithAuth = async ({
    data,
    headers = {},
    method = 'GET' as Method,
    params = {},
    responseType,
    url,
  }: AxiosRequestConfig) => {
    setLoading(true);
    if (!url || !token) {
      setLoading(false);
      return Promise.reject(undefined);
    }

    let fetchToken = token;

    if (!isValidJwt(token)) {
      console.log('FETCH state token is not valid');
      const storageToken = localStorage.getItem(EGO_JWT_KEY) || '';
      if (isValidJwt(storageToken)) {
        console.log('FETCH localStorage token is valid');
        setTokenState(storageToken);
        fetchToken = storageToken;
      } else {
        console.log('FETCH localStorage token is not valid');
        const refreshedJwt = (await refreshJwt().catch(logout)) as string;
        if (isValidJwt(refreshedJwt)) {
          console.log('FETCH refreshed token is valid');
          setTokenState(refreshedJwt);
          fetchToken = refreshedJwt;
        } else {
          console.log('FETCH refreshed token is not valid');
          logout();
          setLoading(false);
          return Promise.reject(undefined);
        }
      }
    }

    const config: AxiosRequestConfig = {
      ...(!['DELETE', 'GET'].includes(method) && { data }),
      baseURL: NEXT_PUBLIC_DAC_API_ROOT,
      cancelToken: cancelTokenSource.token,
      headers: {
        accept: '*/*',
        ...headers,
        Authorization: `Bearer ${fetchToken || ''}`,
      },
      method,
      params,
      ...(responseType ? { responseType } : {}),
      url,
    };

    return axios(config)
      .catch((error) => {
        // status code outside 2xx range
        toaster.addToast({
          title: 'Something went wrong!',
          variant: TOAST_VARIANTS.ERROR,
          content: 'Please try performing your action again.',
        });
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
