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

  const logout = async ({ sessionExpired = true } = {}) => {
    console.log('LOGOUT');
    const storedJwt = getStoredJwt();
    removeUserJwt();
    router.push(`${HOMEPAGE_PATH}${sessionExpired ? '?session_expired=true' : ''}`);
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
  };

  const removeUserJwt = () => {
    console.log('AUTH - remove JWT in state and localStorage');
    handleUserJwt(authContextDefaultValues.token);
  };

  const handleUserJwt = (token: string = authContextDefaultValues.token) => {
    // make sure logout() is handled when using this function.
    console.log('AUTH - update JWT in state and localStorage');
    if (isValidJwt(token)) {
      setStoredJwt(token);
      setUserJwtState(token);
    } else {
      setUserJwtState(authContextDefaultValues.token);
      removeStoredJwt();
    }
  };

  const getUserJwt = async (): Promise<string> => {
    // You need to handle logout() after this function,
    // for cases where this function returns an invalid JWT

    setUserLoading(true);
    if (isValidJwt(userJwtState)) {
      console.log('AUTH - get JWT - state:', userJwtState.slice(-10));
      setUserLoading(false);
      return userJwtState;
    }

    const storedJwt = getStoredJwt();
    if (isValidJwt(storedJwt)) {
      console.log('AUTH - get JWT - localStorage:', storedJwt.slice(-10));
      setUserJwtState(storedJwt);
      setUserLoading(false);
      return storedJwt;
    }

    return refreshJwt().then((refreshedJwt = '') => {
      console.log('refreshedJwt', refreshedJwt.slice(-10));
      if (isValidJwt(refreshedJwt)) {
        handleUserJwt(refreshedJwt);
        setUserLoading(false);
        return refreshedJwt;
      }
      console.log('AUTH - get JWT - none');
      // removeUserJwt();
      // remove JWT in logout() not here
      setUserLoading(false);
      return authContextDefaultValues.token;
    });
  };

  useEffect(() => {
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
          logout({ sessionExpired: true });
        })
        .finally(() => {
          setUserLoading(false);
        });
    }

    if (!ctx.query?.session_expired && ctx.asPath !== LOGGED_IN_PATH) {
      console.log('PAGE CHANGE:', ctx.asPath);
      getUserJwt().then((userJwt: T_AuthContext['token']) => {
        if (!isValidJwt(userJwt) && ctx.asPath !== HOMEPAGE_PATH) {
          logout({ sessionExpired: true });
        }
      });
    }
  }, []);

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

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
