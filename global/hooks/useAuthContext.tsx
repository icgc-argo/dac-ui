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
import usePageContext from './usePageContext';

// TODO: rename these variables. userJwt, userModel, userPermissions
type T_AuthContext = {
  handleUserJwt: (token: string) => void;
  logout: ({ isManual }: { isManual?: boolean }) => void;
  permissions: string[];
  setUserLoading: (loading: boolean) => void;
  token: string;
  user: any;
  userLoading: boolean;
};

const authContextDefaultValues = {
  handleUserJwt: () => {},
  logout: () => {},
  permissions: [],
  setUserLoading: () => {},
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

  const logout = ({ isManual = false } = {}) => {
    console.log('🎃 USER logout');
    router.push(`${HOMEPAGE_PATH}${isManual ? '' : '?session_expired=true'}`);
    removeStoredJwt();
    handleUserJwt(authContextDefaultValues.token);
  };

  const handleUserJwt = (token: string) => {
    console.log('🎃 USER handleUserJwt', token.slice(-10));
    setUserJwtState(token);
    setStoredToken(token);
  };

  useEffect(() => {
    // on page change - doesn't detect navigating to
    // different sections of an application
    if (ctx.asPath === LOGGED_IN_PATH) {
      console.log('🎃 USER /logged-in');
      // router.prefetch(APPLICATIONS_PATH);
      // TODO put back in at the end
      setUserLoading(true);
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
          logout({ isManual: false });
        })
        .finally(() => {
          setUserLoading(false);
        });
    }
  }, []);

  console.log({ ctx });

  useEffect(() => {
    // on page render - DOES detect navigating to
    // different sections of an application
    const handleAuth = async () => {
      console.log('🎃 USER handleAuth');
      setUserLoading(true);
      const storedJwt = getStoredJwt();
      if (storedJwt) {
        if (isValidJwt(storedJwt)) {
          console.log('🎃 USER valid localStorage token', storedJwt.slice(-10));
          setUserJwtState(storedJwt);
        } else {
          console.log('🎃 USER non valid localStorage token', storedJwt.slice(-10));
          const refreshedJwt = (await refreshJwt().catch(logout)) || '';
          if (isValidJwt(refreshedJwt)) {
            console.log('🎃 USER valid refreshed token', refreshedJwt.slice(-10));
            handleUserJwt(refreshedJwt);
          } else {
            console.log('🎃 USER non valid refreshed token', refreshedJwt.slice(-10));
            logout({ isManual: false });
          }
        }
      } else if (ctx.asPath !== HOMEPAGE_PATH) {
        console.log('🎃 USER not homepage, not /logged-in, no token');
        logout({ isManual: false });
      }
      setUserLoading(false);
    };
    if (
      isValidJwt(userJwtState) ||
      (!ctx.query?.session_expired && ctx.asPath !== LOGGED_IN_PATH)
    ) {
      handleAuth();
    }
  });

  const userInfo = userJwtState ? decodeToken(userJwtState) : null;
  const user: T_AuthContext['user'] = userInfo
    ? extractUser(userInfo)
    : authContextDefaultValues.user;
  const permissions: T_AuthContext['permissions'] = getPermissionsFromToken(userJwtState);

  const authContextValue = {
    handleUserJwt,
    logout,
    permissions,
    setUserLoading,
    token: userJwtState,
    user,
    userLoading,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
