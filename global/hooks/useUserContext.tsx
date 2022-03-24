import { getStoredJwt, removeStoredJwt, setStoredToken } from 'global/utils/auth/helpers';
import refreshJwt from 'global/utils/auth/refreshJwt';
import { isValidJwt } from 'global/utils/egoTokenUtils';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { createContext, ReactElement, useContext, useEffect, useState } from 'react';

type T_UserContext = {
  logout: () => void;
  userJwt: string;
};

const userContextDefaultValues = {
  logout: () => {},
  userJwt: '',
};

const UserContext = createContext<T_UserContext>(userContextDefaultValues);

export const UserProvider = ({
  children,
  ctx,
}: {
  children: ReactElement;
  ctx: NextPageContext;
}) => {
  const router = useRouter();
  const [userJwtState, setUserJwtState] = useState<T_UserContext['userJwt']>('');

  const logout = () => {
    removeStoredJwt();
    setUserJwtState(userContextDefaultValues.userJwt);
    router.push('/?session_expired=true');
  };

  const handleUserJwt = (token: string) => {
    setUserJwtState(token);
    setStoredToken(token);
  };

  useEffect(() => {
    const handleAuth = async () => {
      console.log('🎃 USER handleAuth');
      const storedJwt = getStoredJwt();
      if (storedJwt) {
        if (isValidJwt(storedJwt)) {
          console.log('🎃 USER non valid localStorage token', storedJwt.slice(-10));
          setUserJwtState(storedJwt);
        } else {
          console.log('🎃 USER non valid localStorage token', storedJwt.slice(-10));
          const refreshedJwt = (await refreshJwt().catch(logout)) as string;
          if (isValidJwt(refreshedJwt)) {
            console.log('🎃 USER valid refreshed token', refreshedJwt.slice(-10));
            handleUserJwt(refreshedJwt);
          } else {
            console.log('🎃 USER non valid refreshed token', refreshedJwt.slice(-10));
            logout();
          }
        }
      } else if (ctx.asPath !== '/') {
        logout();
      }
    };
    if (!ctx.query?.session_expired) {
      handleAuth();
    }
  });
  return (
    <UserContext.Provider value={{ logout, userJwt: userJwtState }}>
      {children}
    </UserContext.Provider>
  );
};

export default function useUserContext() {
  return useContext(UserContext);
}
