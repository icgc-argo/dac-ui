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
    console.log('app useEffect')
    // using useEffect because we're waiting for localStorage
    const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';

    if (loggingOut) {
      setInitialJwt('');
      if (Component.isPublic) {
        const strippedPath = queryString.exclude(path, ['loggingOut']);
        redirect(res, strippedPath);
      } else {
        redirect(res, '/');
      }
    } else if (egoJwt) {
      if (isValidJwt(egoJwt)) {
        setInitialJwt(egoJwt);
      } else {
        // TODO handle refresh token
        setInitialJwt('');
        localStorage.removeItem(EGO_JWT_KEY);
        redirect(res, getRedirectQuery(path));
      }
    } else {
      if (!Component.isPublic) {
        enforceLogin({ ctx });
      }
    }
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
