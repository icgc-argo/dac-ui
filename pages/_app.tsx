import { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';
import queryString from 'query-string';

import Root from 'components/Root';
import { PageConfigProps, PageWithConfig } from 'global/utils/pages/types';
import { EGO_JWT_KEY } from 'global/constants';
import { isValidJwt } from 'global/utils/egoTokenUtils';
import Router from 'next/router';

const redirect = (res: any, url: string) => {
  if (res) {
    res.writeHead(302, {
      Location: url,
    });
    res.end();
  } else {
    Router.push(url);
  }
};

const getRedirectQuery = (ctxAsPath: string | undefined): string =>
  ctxAsPath ? `/?redirect=${encodeURI(ctxAsPath)}` : '/';

const enforceLogin = ({ ctx }: { ctx: NextPageContext }) => {
  const loginRedirect = getRedirectQuery(ctx.asPath);
  redirect(ctx.res, loginRedirect);
};

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
  const { asPath: path = '', res, query } = ctx;
  const loggingOut = query.loggingOut || false;

  useEffect(() => {
    const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';

    if (loggingOut) {
      console.log('loggingOut')
      if (Component.isPublic) {
        const strippedPath = queryString.exclude(path, ['loggingOut']);
        redirect(res, strippedPath);
      } else {
        console.log('private route')
        redirect(res, '/');
      }
    } else if (egoJwt) {
      if (isValidJwt(egoJwt)) {
        setInitialJwt(egoJwt);
      } else {
        setInitialJwt('');
        localStorage.removeItem(EGO_JWT_KEY);
        // redirect to logout when token is expired/missing only if user is on a non-public page
        if (!Component.isPublic) {
          Router.push({
            pathname: '/',
            query: { session_expired: true },
          });
        }
      }
    }
    // else {
    //   if (!Component.isPublic) {
    //     enforceLogin({ ctx });
    //   }
    // }
  });

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
