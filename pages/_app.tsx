import { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';
import Root from 'components/Root';
import { PageConfigProps, PageWithConfig } from 'global/utils/pages/types';
import { EGO_JWT_KEY } from 'global/constants';
import { isValidJwt } from 'global/utils/egoTokenUtils';
import Router from 'next/router';
import Maintenance from 'components/pages/Error/Maintenance';

// START REFRESH JWT SETUP
import Queue from 'promise-queue';
import urlJoin from 'url-join';
import { getConfig } from 'global/config';

const { NEXT_PUBLIC_EGO_API_ROOT, NEXT_PUBLIC_EGO_CLIENT_ID } = getConfig();

var maxConcurrent = 1;
var maxQueue = Infinity;
var queue = new Queue(maxConcurrent, maxQueue);
const refreshUrl = urlJoin(
  NEXT_PUBLIC_EGO_API_ROOT,
  `/oauth/refresh?client_id=${NEXT_PUBLIC_EGO_CLIENT_ID}`
);

const App = ({
  Component,
  pageProps,
  ctx,
}: {
  Component: PageWithConfig;
  pageProps: PageConfigProps;
  ctx: NextPageContext;
}) => {
  const [initialJwt, setInitialJwt] = useState<string>('');
  const { NEXT_PUBLIC_MAINTENANCE_MODE_ON } = getConfig();

  useEffect(() => {
    console.log('🏎 START USE EFFECT, initialJwt:', initialJwt.substring(0, 10));
    const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';
    console.log('🎟 EGO JWT:', egoJwt.substring(0, 10))
    if (isValidJwt(egoJwt)) {
      console.log('✅ INITIAL EGO_JWT WAS VALID:', egoJwt.substring(0, 10));
      setInitialJwt(egoJwt);
    } else if (egoJwt) {
      console.log('❌ INITIAL EGO_JWT INVALID, ATTEMPTING REFRESH:', egoJwt.substring(0, 10));
      const forceLogout = () => {
        console.log('💀 FORCE LOGOUT');
        setInitialJwt('');
        localStorage.removeItem(EGO_JWT_KEY);
        if (!Component.isPublic) {
          Router.push({
            pathname: '/',
            query: { session_expired: true },
          });
        }
      };

      queue.add(() =>
        fetch(refreshUrl, {
          credentials: 'include', // sends refreshId cookie
          headers: {
            accept: '*/*',
            authorization: `Bearer ${egoJwt}`,
          },
          method: 'POST',
        })
          .then(res => res.text())
          .then(newJwt => {
            if (isValidJwt(newJwt)) {
              console.log('🎉 REFRESH VALID:', newJwt.substring(0, 10));
              setInitialJwt(newJwt);
              localStorage.setItem(EGO_JWT_KEY, newJwt);
            } else {
              console.log('💥 REFRESH WASN\'T VALID:', newJwt.substring(0, 10));
              forceLogout();
            }
          })
          .catch((err) => {
            console.log('🧤 CATCH:', err);
            forceLogout();
          })
      );
    } else {
      console.log('💫 NO INITIAL EGO_JWT FOUND');
      if (!Component.isPublic) {
        Router.push({
          pathname: '/',
        });
      }
    }
  });

  return (
    <Root egoJwt={initialJwt} pageContext={ctx}>
      {NEXT_PUBLIC_MAINTENANCE_MODE_ON ? <Maintenance /> : <Component {...pageProps} />}
    </Root>
  );
};

App.getInitialProps = async ({ ctx, Component }: AppContext & { Component: PageWithConfig }) => {
  const pageProps = Component.getInitialProps && (await Component.getInitialProps({ ...ctx }));
  return {
    ctx: {
      pathname: ctx.pathname,
      query: ctx.query,
      asPath: ctx.asPath,
    },
    pageProps,
  };
};

export default App;
