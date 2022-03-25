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
import fetchEgoJwt from 'global/utils/auth/fetchEgoJwt';
import { getStoredJwt, removeStoredJwt, setStoredToken } from 'global/utils/auth/helpers';
import refreshJwt from 'global/utils/auth/refreshJwt';
import {
  decodeToken,
  extractUser,
  getPermissionsFromToken,
  isValidJwt,
} from 'global/utils/egoTokenUtils';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { createContext, ReactElement, useContext, useEffect, useState } from 'react';

// TODO: rename these variables. userJwt, userModel, userPermissions
type T_UserContext = {
  // logout: () => void;
  logout: any;
  token: string;
  user: any;
  permissions: any;
};

const userContextDefaultValues = {
  logout: () => {},
  token: '',
  permissions: [],
  user: null,
};

const UserContext = createContext<T_UserContext>(userContextDefaultValues);

export const UserProvider = ({
  children,
  ctx,
}: {
  children: ReactElement;
  ctx: NextPageContext;
}) => {
  const [userJwtState, setUserJwtState] = useState<T_UserContext['token']>(
    userContextDefaultValues.token,
  );
  const [user, setUser] = useState<T_UserContext['user']>(userContextDefaultValues.user);
  const [permissions, setPermissions] = useState<T_UserContext['permissions']>(
    userContextDefaultValues.permissions,
  );

  const router = useRouter();

  const logout = ({ isManual = false } = {}) => {
    console.log('🎃 USER logout');
    removeStoredJwt();
    setUserJwtState(userContextDefaultValues.token);
    router.push(`${HOMEPAGE_PATH}${isManual ? '' : '?session_expired=true'}`);
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
          logout();
        });
    }
  }, []);

  useEffect(() => {
    // on page render - DOES detect navigating to
    // different sections of an application
    const handleAuth = async () => {
      console.log('🎃 USER handleAuth');
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
            logout();
          }
        }
      } else if (ctx.asPath !== HOMEPAGE_PATH) {
        console.log('🎃 USER not homepage, not /logged-in, no token');
        logout();
      }
    };
    if (
      isValidJwt(userJwtState) ||
      (!ctx.query?.session_expired && ctx.asPath !== LOGGED_IN_PATH)
    ) {
      handleAuth();
    }
  });

  useEffect(() => {
    // on user JWT change
    // TODO make a reducer to cut down on re-renders
    const userInfo = userJwtState ? decodeToken(userJwtState) : null;
    const nextUser = userInfo ? extractUser(userInfo) : undefined;
    const nextPermissions = getPermissionsFromToken(userJwtState);
    setUser(nextUser);
    setPermissions(nextPermissions);
  }, [userJwtState]);

  const userContextValue = {
    logout,
    token: userJwtState,
    user,
    permissions,
  };

  return <UserContext.Provider value={userContextValue}>{children}</UserContext.Provider>;
};

export default function useUserContext() {
  return useContext(UserContext);
}
