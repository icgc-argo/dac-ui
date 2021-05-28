import { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';

import Root from 'components/Root';
import { PageConfigProps, PageWithConfig } from 'global/utils/pages/types';
import { EGO_JWT_KEY } from 'global/constants';
import { isValidJwt } from 'global/utils/egoTokenUtils';
import Router from 'next/router';

const App = ({
  Component,
  pageProps,
  ctx,
}: {
  Component: PageWithConfig;
  pageProps: PageConfigProps;
  ctx: NextPageContext;
}) => {
  const [initialJwt, setInitialJwt] = useState<string | undefined>();
  useEffect(() => {
    const egoJwt = localStorage.getItem(EGO_JWT_KEY) || undefined;
    if (isValidJwt(egoJwt)) {
      setInitialJwt(egoJwt);
    } else {
      setInitialJwt(undefined);
      localStorage.removeItem(EGO_JWT_KEY);
      // redirect to logout when token is expired/missing only if user is on a non-public page
      if (!Component.isPublic) {
        Router.push({
          pathname: '/',
          query: { session_expired: true },
        });
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
