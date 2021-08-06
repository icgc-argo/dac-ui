import { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';

import Root from 'components/Root';
import { PageConfigProps, PageWithConfig } from 'global/utils/pages/types';
import { EGO_JWT_KEY } from 'global/constants';
import { isValidJwt } from 'global/utils/egoTokenUtils';
import Router from 'next/router';

// START REFRESH JWT SETUP
import Queue from 'promise-queue';
import urlJoin from 'url-join';
import { getConfig } from 'global/config';

const { NEXT_PUBLIC_EGO_API_ROOT, NEXT_PUBLIC_EGO_CLIENT_ID } = getConfig();

var maxConcurrent = 1;
var maxQueue = Infinity;
var queue = new Queue(maxConcurrent, maxQueue);
// pass client_id to get ego api to set correct response headers
const refreshUrl = urlJoin(
  NEXT_PUBLIC_EGO_API_ROOT,
  `/oauth/refresh?client_id=${NEXT_PUBLIC_EGO_CLIENT_ID}`
);
// END REFRESH JWT SETUP

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

  // START REFRESH TOKEN USEEFFECT
  const isSessionExpired = ctx.query.session_expired;
  useEffect(() => {
    console.log('👾 START USE EFFECT')
    // if (isSessionExpired) return;
    const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';
    console.log('🎟 EGO JWT', egoJwt)
    if (isValidJwt(egoJwt)) {
      console.log('✅ INITIAL TOKEN WAS VALID')
      setInitialJwt(egoJwt);
    } else {
      console.log('❌ INITIAL TOKEN INVALID')
      const forceLogout = () => {
        console.log('💨 FORCE LOGOUT')
        // setInitialJwt('');
        // localStorage.removeItem(EGO_JWT_KEY);
        // if (!Component.isPublic) {
        //   Router.push({
        //     pathname: '/',
        //     query: { session_expired: true },
        //   });
        // }
      };

      const fetchOptions = {
        credentials: 'include',
        headers: {
          accept: '*/*',
          authorization: egoJwt ? `Bearer ${egoJwt}` : undefined,
        },
        method: 'POST',
      };

      console.log({ fetchOptions })

      queue.add(() =>
        // why is this firing on initial load? is it still in the queue from the previous time?
        fetch(refreshUrl, {
          credentials: 'include',
          headers: {
            accept: '*/*',
            authorization: `Bearer ${egoJwt}`,
          },
          method: 'POST',
        })
          .then(res => {
            console.log('⛑ RESPONSE', res)
            console.log(res.text())
            return res.text();
          })
          .then(newJwt => {
            if (isValidJwt(newJwt)) {
              console.log('🌈 REFRESH VALID', newJwt)
              setInitialJwt(newJwt);
              localStorage.setItem(EGO_JWT_KEY, newJwt);
            } else {
              console.log('⛈ REFRESH WASN\'T VALID', newJwt)
              forceLogout();
            }
          })
          .catch((err) => {
            console.log('🧤 CATCH', err)
            forceLogout();
          })
      );
    }
  });
  // END REFRESH TOKEN USEEFFECT

  // OLD useEffect
  // useEffect(() => {
  //   const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';
  //   if (isValidJwt(egoJwt)) {
  //     setInitialJwt(egoJwt);
  //   } else {
  //     setInitialJwt('');
  //     localStorage.removeItem(EGO_JWT_KEY);
  //     // redirect to logout when token is expired/missing only if user is on a non-public page
  //     if (!Component.isPublic) {
  //       Router.push({
  //         pathname: '/',
  //         query: { session_expired: true },
  //       });
  //     }
  //   }
  // });


  return (
    <Root egoJwt={initialJwt} pageContext={ctx}>
      <Component {...pageProps} />
    </Root>
  );
};

App.getInitialProps = async ({ ctx, Component }: AppContext & { Component: PageWithConfig }) => {
  const pageProps = await Component.getInitialProps({ ...ctx });
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
