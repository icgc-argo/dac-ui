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

import { TOAST_VARIANTS } from '@icgc-argo/uikit/notifications/Toast';
import axios, { AxiosRequestConfig, Canceler, Method } from 'axios';
import { getConfig } from 'global/config';
import router from 'next/router';
import Router from 'next/router';
import React, { createContext, useContext, useState } from 'react';
import urlJoin from 'url-join';
import { egoRefreshUrl, EGO_JWT_KEY } from '../constants';
import { UserWithId } from '../types';
import {
  decodeToken,
  extractUser,
  getPermissionsFromToken,
  isValidJwt,
} from '../utils/egoTokenUtils';
import { useToaster } from './useToaster';
import queryString from 'query-string';

type T_AuthContext = {
  cancelFetchWithAuth: Canceler;
  fetchWithAuth: any;
  isLoading: boolean;
  logout: ({ isManual }: { isManual: boolean }) => void;
  permissions: string[];
  token?: string;
  user?: UserWithId | void;
};

const AuthContext = createContext<any>({
  cancelFetchWithAuth: () => {},
  token: '',
  isLoading: false,
  logout: () => {},
  user: undefined,
  fetchWithAuth: () => {},
  permissions: [],
});

// TODO: decide if we want these for all types of requests or only POST
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const SESSION_EXPIRED_KEY = 'session_expired';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO: typing this state as `string` causes a compiler error. the same setup exists in argo but does not cause
  // a type issue. using `any` for now
  const [isLoading, setLoading] = useState<boolean>(false);
  const [token, setTokenState] = useState<any>('');
  const { NEXT_PUBLIC_DAC_API_ROOT } = getConfig();
  const toaster = useToaster();

  React.useEffect(() => {
    // multiple tabs, close/reopen window
    const init = async () => {
      setLoading(true);
      const jwt = await getValidToken();
      // jwt will be null if user has not logged in
      if (jwt !== null) setToken(jwt);
      setLoading(false);
    };
    init();
  }, []);

  React.useEffect(() => {
    const handleRouteChange = (url: any) => {
      // get everything in url after /
      // /applications, need better url parsing
      const queries = queryString.parse(url.slice(1));
      console.log('queryies', queries);
      if (!!queries[SESSION_EXPIRED_KEY] === true) {
        deleteTokens();
        setTokenState('');
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  const logout = () => {
    Router.push({ pathname: '/', query: `${SESSION_EXPIRED_KEY}=true` });
  };

  /**
   * global loader in Root
   */

  const cancelTokenSource = axios.CancelToken.source();
  const cancelFetchWithAuth = cancelTokenSource.cancel;

  const setToken = (token: string) => {
    // todo: err handler
    localStorage.setItem(EGO_JWT_KEY, token);
    setTokenState(token);
  };

  const getValidToken = async () => {
    const token = localStorage.getItem(EGO_JWT_KEY);
    if (token === null) {
      // user not logged in
      return null;
    } else if (!isValidJwt(token)) {
      const refreshedJwt = await refreshJwt(token);
      setToken(refreshedJwt);
      return refreshedJwt;
    }
    return token;
  };

  const fetchWithAuth = async ({
    data,
    headers = {},
    method = 'GET' as Method,
    params = {},
    responseType,
    url,
  }: AxiosRequestConfig) => {
    setLoading(true);

    // !token should be handled later, probably not even here, just get me a valid token
    if (!url || !token) {
      setLoading(false);
      return Promise.reject(undefined);
    }

    // todo: in what case is our refreshed token not valid

    const fetchToken = await getValidToken();

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

  const fetchInitEgo = async () => {
    // if we have a token already, just return it
    setLoading(true);
    const jwt = await fetchEgoToken();
    setToken(jwt);
  };

  const authData = {
    cancelFetchWithAuth,
    fetchWithAuth,
    isLoading,
    logout,
    permissions,
    token,
    user,
    fetchInitEgo,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default function useAuthContext() {
  return useContext(AuthContext);
}

export const fetchEgoToken = () => {
  const { NEXT_PUBLIC_EGO_API_ROOT, NEXT_PUBLIC_EGO_CLIENT_ID } = getConfig();
  const egoLoginUrl = urlJoin(
    NEXT_PUBLIC_EGO_API_ROOT,
    `/oauth/ego-token?client_id=${NEXT_PUBLIC_EGO_CLIENT_ID}`,
  );

  return (
    fetch(egoLoginUrl, {
      credentials: 'include',
      headers: { accept: '*/*' },
      body: null,
      method: 'POST',
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error();
        }
        return res.text();
      })
      .then((jwt) => {
        //if (isValidJwt(jwt)) return localStorage.setItem(EGO_JWT_KEY, jwt);
        console.log('fetch ego token', jwt);
        return jwt;
      })
      //.then(() => Router.push(APPLICATIONS_PATH))
      .catch((err) => {
        /*  console.warn(err);
        localStorage.removeItem(EGO_JWT_KEY);
        Router.push('/'); */
        throw new Error('Invalid jwt, cannot login.');
      })
  );
};

const deleteTokens = () => {
  const storedToken = localStorage.getItem(EGO_JWT_KEY) || '';

  console.log('DELETE TOKENS jwt in localStorage', storedToken.slice(-10));

  if (storedToken) {
    fetch(egoRefreshUrl, {
      credentials: 'include',
      headers: {
        accept: '*/*',
        authorization: `Bearer ${storedToken}`,
      },
      method: 'DELETE',
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error();
        }
        console.log('DELETE REFRESH deleted the refresh token', res);
      })
      .catch((err) => {
        console.warn(err);
      })
      .finally(() => {
        console.log('DELETE TOKENS finally delete localStorage jwt');
        localStorage.removeItem(EGO_JWT_KEY);
      });
  }
};

const refreshJwt = (invalidToken: string) => {
  return fetch(egoRefreshUrl, {
    credentials: 'include',
    headers: {
      accept: '*/*',
      authorization: `Bearer ${invalidToken}`,
    },
    method: 'POST',
  })
    .then((res) => res.text())
    .then((token) => {
      if (isValidJwt(token)) {
        console.log('REFRESH valid refreshed token', token.slice(-10));
        return token;
      } else {
        console.warn('invalid jwt', token);
        return '';
      }
    });
};

// TODO: TEST ME <#
