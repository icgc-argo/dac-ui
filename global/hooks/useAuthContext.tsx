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
  getStoredJwt,
  refreshJwt,
  removeStoredJwt,
  setStoredToken,
  fetchEgoJwt,
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

type T_AuthContext = {
  getUserJwt: () => string | Promise<string>;
  logout: ({ sessionExpired }: { sessionExpired?: boolean }) => void;
  permissions: string[];
  token: string;
  user: any;
  userLoading: boolean;
};

const authContextDefaultValues = {
  getUserJwt: () => '',
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

  const logout = ({ sessionExpired = true } = {}) => {
    console.log('AUTH - logout');
    const storedJwt = getStoredJwt();
    removeStoredJwt();
    handleUserJwt(authContextDefaultValues.token);
    router.push(`${HOMEPAGE_PATH}${sessionExpired ? '?session_expired=true' : ''}`);
    fetch(egoRefreshUrl, {
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

  const handleUserJwt = (token: string) => {
    console.log('AUTH - handleUserJwt');
    setUserJwtState(token);
    setStoredToken(token);
  };

  const getUserJwt = async () => {
    setUserLoading(true);
    if (isValidJwt(userJwtState)) {
      console.log('AUTH - getUserJwt - state', userJwtState.slice(-10));
      setUserLoading(false);
      return userJwtState;
    }

    const storedJwt = getStoredJwt();
    if (isValidJwt(storedJwt)) {
      console.log('AUTH - getUserJwt - localStorage', storedJwt.slice(-10));
      setUserJwtState(storedJwt);
      setUserLoading(false);
      return storedJwt;
    }

    const refreshedJwt = await refreshJwt();
    if (isValidJwt(refreshedJwt)) {
      console.log('AUTH - getUserJwt - refreshed', refreshedJwt.slice(-10));
      handleUserJwt(refreshedJwt);
      setUserLoading(false);
      return refreshedJwt;
    }

    console.log('AUTH - getUserJwt - none');
    handleUserJwt(authContextDefaultValues.token);
    setUserLoading(false);
    return authContextDefaultValues.token;
  };

  const handleAuth = async () => {
    console.log('AUTH - handleAuth');
    const userJwt = await getUserJwt();
    if (!isValidJwt(userJwt) && ctx.asPath !== HOMEPAGE_PATH) {
      logout({ sessionExpired: true });
    }
  };

  useEffect(() => {
    console.log('PAGE CHANGE');
    if (ctx.asPath === LOGGED_IN_PATH) {
      console.log('AUTH - /logged-in');
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

    if (
      isValidJwt(userJwtState) ||
      (!ctx.query?.session_expired && ctx.asPath !== LOGGED_IN_PATH)
    ) {
      handleAuth();
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
