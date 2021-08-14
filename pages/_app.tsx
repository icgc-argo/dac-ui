import { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';
import Root from 'components/Root';
import { PageConfigProps, PageWithConfig } from 'global/utils/pages/types';
import { EGO_JWT_KEY } from 'global/constants';
import { isValidJwt } from 'global/utils/egoTokenUtils';
import Router from 'next/router';
import Maintenance from 'components/pages/Error/Maintenance';
import { getConfig } from 'global/config';
import queryString from 'query-string';
import { get, omit } from 'lodash';
import { fetchEgoToken, OAUTH_QUERY_PARAM_NAME } from 'global/utils/authUtils';
import Loader from 'components/Loader';

const redirectTo = (url: string) => {
  Router.push(url);
};

const makeRedirectPath = (ctxAsPath: string | undefined): string => {
  const path = ctxAsPath ? `/?redirect=${encodeURI(ctxAsPath)}` : '/';
  return path;
};

const enforceLogin = ({ ctx }: { ctx: NextPageContext }) => {
  const loginRedirect = makeRedirectPath(ctx.asPath);
  redirectTo(loginRedirect);
};

const checkOauthMode = (ctx: any) => {
  if (get(ctx?.query, 'redirect')) {
    const parsed = queryString.parseUrl(decodeURIComponent(ctx.query.redirect));
    return get(parsed.query, OAUTH_QUERY_PARAM_NAME) === 'true';
  } else {
    return false;
  }
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
  const [isLoadingLoginRedirect, setIsLoadingLoginRedirect] = useState<boolean>(checkOauthMode(ctx));
  const { NEXT_PUBLIC_MAINTENANCE_MODE_ON } = getConfig();

  useEffect(() => {
    const isOauth = checkOauthMode(ctx);
    setIsLoadingLoginRedirect(isOauth);

    const egoJwt = localStorage.getItem(EGO_JWT_KEY) || '';
    const isEgoJwtValid = isValidJwt(egoJwt);

    if (isEgoJwtValid) {
      setInitialJwt(egoJwt);
    }

    if (isOauth) {
      const redirectPath = decodeURIComponent(get(ctx.query, 'redirect') as string);
      const obj = queryString.parseUrl(redirectPath || '');
      const target = queryString.stringifyUrl({
        ...obj,
        query: omit(obj.query, OAUTH_QUERY_PARAM_NAME),
      });
      Router.prefetch(target);
      const egoToken = fetchEgoToken(target) as unknown as string;
      setInitialJwt(egoToken);
    }

    if (!egoJwt && !isOauth) {
      setInitialJwt('');
      localStorage.removeItem(EGO_JWT_KEY);
      if (!Component.isPublic) {
        enforceLogin({ ctx })
      }
    }
  });

  return (
    <Root egoJwt={initialJwt} pageContext={ctx}>
      {NEXT_PUBLIC_MAINTENANCE_MODE_ON
        ? <Maintenance />
        : isLoadingLoginRedirect
          ? <Loader />
          : <Component {...pageProps} />}
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
