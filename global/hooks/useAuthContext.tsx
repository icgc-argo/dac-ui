/*
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
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

import Queue from 'promise-queue';
import { APPLICATIONS_PATH, HOMEPAGE_PATH, LOGGED_IN_PATH } from 'global/constants/internalPaths';
import {
  fetchEgoJwt,
  getStoredJwt,
  refreshJwt,
  removeStoredJwt,
  setStoredJwt,
} from 'global/utils/authUtils';
import {
  decodeToken,
  extractUser,
  getPermissionsFromToken,
  isValidJwt,
} from 'global/utils/egoTokenUtils';
import { useRouter } from 'next/router';
import { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import { usePageContext } from 'global/hooks';
import { egoRefreshUrl } from 'global/constants/externalPaths';
import { UserWithId } from 'global/types';
import { css } from '@emotion/core';
import DnaLoader from '@icgc-argo/uikit/DnaLoader';

export enum GetUserJwt_Types {
  FETCH_WITH_AUTH = 'FETCH_WITH_AUTH',
  PAGE_LOAD = 'PAGE_LOAD',
  ROUTE_CHANGE = 'ROUTE_CHANGE',
}

export type GetUserJwt_Args = {
  type: GetUserJwt_Types;
  url?: string;
};

export type T_AuthContext = {
  getUserJwt: ({ type, url }: GetUserJwt_Args) => Promise<string>;
  logout: ({ sessionExpired }: { sessionExpired?: boolean }) => void;
  permissions: string[];
  token: string;
  user?: UserWithId;
  userLoading: boolean;
};

const authContextDefaultValues = {
  getUserJwt: () => Promise.resolve(''),
  logout: () => {},
  permissions: [],
  token: '',
  user: undefined,
  userLoading: true,
};

const AuthContext = createContext<T_AuthContext>(authContextDefaultValues);

export const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [userJwtState, setUserJwtState] = useState<T_AuthContext['token']>(
    authContextDefaultValues.token,
  );
  const [userLoading, setUserLoading] = useState<T_AuthContext['userLoading']>(
    authContextDefaultValues.userLoading,
  );

  const ctx = usePageContext();

  const router = useRouter();

  const logout = async ({ sessionExpired = true, redirect = true, url = '' } = {}) => {
    console.log('LOGOUT');
    const storedJwt = getStoredJwt();
    removeUserJwt();
    if (redirect) {
      router.push(`${HOMEPAGE_PATH}${sessionExpired ? '?session_expired=true' : ''}`);
    } else if (sessionExpired && url === HOMEPAGE_PATH) {
      router.push(`${HOMEPAGE_PATH}?session_expired=true`, undefined, {
        shallow: true,
      });
    }
    if (storedJwt) {
      await fetch(egoRefreshUrl, {
        credentials: 'include',
        headers: {
          accept: '*/*',
          authorization: `Bearer ${storedJwt}`,
        },
        method: 'DELETE',
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error();
          }
          console.log('AUTH - deleted the refresh token');
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  };

  const removeUserJwt = () => {
    console.log('AUTH - remove JWT in state and localStorage');
    handleUserJwt();
  };

  const handleUserJwt = (token: string = authContextDefaultValues.token) => {
    console.log('AUTH - update JWT in state and localStorage');
    if (isValidJwt(token)) {
      setStoredJwt(token);
      setUserJwtState(token);
    } else {
      setUserJwtState(authContextDefaultValues.token);
      removeStoredJwt();
    }
  };

  const forceLogout = (url: string, addSessionExpiredParam: boolean) => {
    console.log(
      'forceLogout URL:',
      url,
      'addSessionExpiredParam:',
      addSessionExpiredParam,
      'asPath:',
      ctx.asPath,
    );
    // don't add the session_expired param if the user was visiting the homepage
    // but DO add it if the user was navigating to the homepage from another page
    logout({
      sessionExpired: addSessionExpiredParam || ctx.asPath !== HOMEPAGE_PATH,
      redirect: url !== HOMEPAGE_PATH,
      url,
    });

    if (url === HOMEPAGE_PATH) {
      setUserLoading(false);
    }
  };

  const authMaxConcurrent = 1;
  const authMaxQueue = Infinity;
  const authQueue = new Queue(authMaxConcurrent, authMaxQueue);

  const getUserJwt = async ({ url, type }: GetUserJwt_Args) =>
    authQueue.add(
      async (): Promise<string> => {
        const isQueueEmpty = authQueue.getQueueLength() === 0;
        // provide a URL if it's different from ctx.asPath
        // e.g. for route changes, this function needs to know the destination URL
        const currentUrl = url || ctx.asPath || '';
        if (isValidJwt(userJwtState)) {
          console.log('AUTH - get JWT - state:', userJwtState.slice(-10));
          setUserLoading(!isQueueEmpty);
          return userJwtState;
        }

        const storedJwt = getStoredJwt();

        if (!storedJwt) {
          console.log('AUTH - get JWT - none, logout');
          forceLogout(currentUrl, type === GetUserJwt_Types.ROUTE_CHANGE);
          return authContextDefaultValues.token;
        }

        if (isValidJwt(storedJwt)) {
          console.log('AUTH - get JWT - localStorage:', storedJwt.slice(-10));
          setUserJwtState(storedJwt);
          setUserLoading(!isQueueEmpty);
          return storedJwt;
        }

        setUserLoading(true);

        return refreshJwt()
          .then((refreshedJwt = '') => {
            console.log('AUTH - get JWT - refreshed JWT:', refreshedJwt.slice(-10));
            if (isValidJwt(refreshedJwt)) {
              handleUserJwt(refreshedJwt);
              setUserLoading(!isQueueEmpty);
              return refreshedJwt;
            }
            throw new Error('AUTH - get JWT - refresh failed, logout');
          })
          .catch((e: any) => {
            console.error(e);
            forceLogout(currentUrl, type === GetUserJwt_Types.ROUTE_CHANGE);
            return authContextDefaultValues.token;
          });
      },
    );

  useEffect(() => {
    console.log('PAGE CHANGE', ctx);
    if (ctx.query?.session_expired) {
      setUserLoading(false);
    }

    if (ctx.asPath === LOGGED_IN_PATH) {
      console.log('LOGGED-IN');
      setUserLoading(true);
      router.prefetch(APPLICATIONS_PATH);
      fetchEgoJwt()
        .then((egoJwt = '') => {
          if (isValidJwt(egoJwt)) {
            handleUserJwt(egoJwt);
            return;
          }
          throw new Error('Invalid JWT, cannot login');
        })
        .then(() => router.push(APPLICATIONS_PATH))
        .catch((err) => {
          console.warn(err);
          logout({ sessionExpired: true, redirect: true });
        })
        .finally(() => {
          setUserLoading(false);
        });
    }

    if (!ctx.query?.session_expired && ctx.asPath !== LOGGED_IN_PATH) {
      console.log('PAGE CHANGE:', ctx.asPath);
      getUserJwt({ type: GetUserJwt_Types.PAGE_LOAD });
    }
  }, []);

  useEffect(() => {
    const handleStart = (url: string) => {
      console.log('ROUTER START:', url, typeof url);
      if (!url.includes('session_expired=true') && url !== LOGGED_IN_PATH) {
        getUserJwt({ type: GetUserJwt_Types.ROUTE_CHANGE, url });
      }
    };

    const handleComplete = (url: string) => {
      if (url.includes('session_expired=true')) {
        setUserLoading(false);
      }
    };

    const handleError = (err: any, url: string) => {
      console.error(err);
      handleComplete(url);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);

  const userInfo = userJwtState ? decodeToken(userJwtState) : null;
  const user: T_AuthContext['user'] = userInfo
    ? extractUser(userInfo)
    : authContextDefaultValues.user;
  const permissions: T_AuthContext['permissions'] = getPermissionsFromToken(userJwtState);

  const authContextValue = {
    getUserJwt,
    logout,
    permissions,
    token: userJwtState,
    user,
    userLoading: userLoading && !userJwtState,
  };

  console.log('userLoading', userLoading);

  return (
    <AuthContext.Provider value={authContextValue}>
      {userLoading ? (
        <div
          css={css`
            align-items: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
          `}
        >
          <DnaLoader />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
