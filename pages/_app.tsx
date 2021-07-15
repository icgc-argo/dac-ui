import { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';

import Root from 'components/Root';
import { PageConfigProps, PageWithConfig } from 'global/utils/pages/types';
import { EGO_JWT_KEY } from 'global/constants';
import { isValidJwt } from 'global/utils/egoTokenUtils';
import Router from 'next/router';
import DnaLoader from '@icgc-argo/uikit/DnaLoader';
import queryString from 'query-string';

const App = ({
  Component,
  pageProps,
  ctx,
}: {
  Component: PageWithConfig;
  pageProps: PageConfigProps;
  ctx: NextPageContext;
}) => {
  // once JWT has been checked it'll be a string.
  const [initialJwt, setInitialJwt] = useState<string | undefined>(undefined);

  useEffect(() => {
    // only handle getting/removing token here.
    const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';
    if (isValidJwt(egoJwt)) {
      console.log('🏠 valid JWT ✅');
      setInitialJwt(egoJwt);
    } else {
      console.log('🏠 invalid JWT ❌');
      setInitialJwt('');
      localStorage.removeItem(EGO_JWT_KEY);
    }
  });

  useEffect(() => {
    // handle redirects after JWT is checked.
    // setting the default as undefined prevents
    // this hook from running before JWT is checked.

    if (typeof initialJwt !== 'undefined') {
      console.log('🏠 JWT updated ⬆️');
      const decoded = decodeURIComponent(ctx.asPath || '');
      Router.push(decoded)
      if (!initialJwt && !Component.isPublic) {
        console.log('APP: private page, no auth')
        // TODO: redirect param should be asPath with query removed.
        const loggingOutPath = `/?loggingOut=true${!ctx.asPath || ctx.asPath === '/'
          ? ''
          : `&redirect=${encodeURIComponent(encodeURIComponent(ctx.asPath))}`
          }`;
        Router.push(loggingOutPath);
      }
    }
  }, [initialJwt]);

  return (
    <Root egoJwt={initialJwt} pageContext={ctx}>
      {initialJwt || Component.isPublic
        ? <Component {...pageProps} />
        : <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'cyan' }}><DnaLoader /></div>}
    </Root>
  );
};

App.getInitialProps = async ({ ctx, Component }: AppContext & { Component: PageWithConfig }) => {
  const pageProps = await Component.getInitialProps({ ...ctx });

  console.log('🏠', { ctx, pageProps })

  const path = ctx.asPath || '';

  // intercept redirects from ego to /logged-in
  // still causes an ugly 404/redirect experience

  const isLoginRedirect = path.startsWith('/logged-in%3Fredirect%3D');
  const decodePath = isLoginRedirect ? queryString.parseUrl(path) : null;
  console.log('🏠', { decodePath })

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
