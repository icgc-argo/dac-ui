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

import { APPLICATIONS_PATH, HOMEPAGE_PATH, LOGGED_IN_PATH } from 'global/constants/internalPaths';
import {
  fetchEgoJwt,
  getStoredJwt,
  refreshJwt,
  removeStoredJwt,
  setStoredJwt,
  forceString,
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

export type T_AuthContext = {
  getUserJwt: () => Promise<string>;
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

  const logout = async ({ sessionExpired = true, redirect = true } = {}) => {
    console.log('LOGOUT');
    const storedJwt = getStoredJwt();
    removeUserJwt();
    if (redirect) {
      router.push(`${HOMEPAGE_PATH}${sessionExpired ? '?session_expired=true' : ''}`);
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
    handleUserJwt(authContextDefaultValues.token);
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

  const handleLogout = (url: string = '') => {
    console.log('✨ handleLogout', url);
    logout({
      sessionExpired: ctx.asPath !== HOMEPAGE_PATH,
      redirect: url !== HOMEPAGE_PATH,
    });

    if (url === HOMEPAGE_PATH) {
      setUserLoading(false);
    }
  };

  const getUserJwt = async (url: string = ''): Promise<string> => {
    const currentUrl = url || ctx.asPath || '';
    if (isValidJwt(userJwtState)) {
      console.log('AUTH - get JWT - state:', userJwtState.slice(-10));
      setUserLoading(false);
      return userJwtState;
    }

    const storedJwt = getStoredJwt();

    if (!storedJwt) {
      console.log('AUTH - get JWT - none, logout');
      handleLogout(currentUrl);
      return authContextDefaultValues.token;
    }

    if (isValidJwt(storedJwt)) {
      console.log('AUTH - get JWT - localStorage:', storedJwt.slice(-10));
      setUserJwtState(storedJwt);
      setUserLoading(false);
      return storedJwt;
    }

    setUserLoading(true);

    return refreshJwt()
      .then((refreshedJwt = '') => {
        console.log('AUTH - get JWT - refreshed JWT:', refreshedJwt.slice(-10));
        if (isValidJwt(refreshedJwt)) {
          handleUserJwt(refreshedJwt);
          setUserLoading(false);
          return refreshedJwt;
        }
        throw new Error('AUTH - get JWT - refresh failed, logout');
      })
      .catch((e) => {
        console.error(e);
        handleLogout(currentUrl);
        return authContextDefaultValues.token;
      });
  };

  useEffect(() => {
    if (ctx.query?.session_expired) {
      setUserLoading(false);
    }

    if (ctx.asPath === LOGGED_IN_PATH) {
      console.log('PAGE CHANGE', ctx.asPath);
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
      getUserJwt();
    }
  }, []);

  useEffect(() => {
    const handleStart = (url?: any) => {
      console.log('ROUTER START:', url, typeof url);
      if (!forceString(url).includes('session_expired=true') && url !== LOGGED_IN_PATH) {
        getUserJwt(forceString(url));
      }
    };

    const handleStop = (url?: any) => {
      if (forceString(url).includes('session_expired=true')) {
        setUserLoading(false);
      }
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
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
