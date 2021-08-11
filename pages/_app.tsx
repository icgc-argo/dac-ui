import { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';
import Root from 'components/Root';
import { PageConfigProps, PageWithConfig } from 'global/utils/pages/types';
import { EGO_JWT_KEY, LOGGED_IN_PATH } from 'global/constants';
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

  const logoutToHomepage = () => {
    console.log('💀 _app - logout to homepage');
    setInitialJwt('');
    localStorage.removeItem(EGO_JWT_KEY);
    // redirect to logout when token is expired/missing only if user is on a non-public page
    if (!Component.isPublic) {
      Router.push({
        pathname: '/',
        query: { app_session_expired: true },
      });
    }
  };

  useEffect(() => {
    console.log('🏎 _app - start useEffect - initialJwt in state:', initialJwt.slice(-10));
    if (ctx.asPath?.includes(LOGGED_IN_PATH)) return; // logged-in page handles its own auth
    const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';
    console.log('🎟 _app - initial localStorage JWT:', egoJwt.slice(-10));
    if (isValidJwt(egoJwt)) {
      console.log('✅ _app - initial localStorage JWT is valid:', egoJwt.slice(-10));
      setInitialJwt(egoJwt);
    } else if (egoJwt) {
      console.log('⏸ _app - initial localStorage JWT is NOT valid:', egoJwt.slice(-10));
      // if jwt isn't valid, check for refresh token
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
          .then(refreshedJwt => {
            if (isValidJwt(refreshedJwt)) {
              console.log('🎉 _app - refresh token IS valid:', refreshedJwt.slice(-10));
              setInitialJwt(refreshedJwt);
              localStorage.setItem(EGO_JWT_KEY, refreshedJwt);
            } else {
              console.log('💥 _app - refresh token NOT valid:', refreshedJwt.slice(-10));
              logoutToHomepage();
            }
          })
          .catch((err) => {
            console.log('🧤 _app - refresh token error:', err);
            logoutToHomepage();
          })
      );
    } else {
      logoutToHomepage();
    }
  }); // dependencies currently cause page header to not update

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
