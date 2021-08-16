// login, redirect on login, refresh token, etc

import { getConfig } from "global/config";
import { APPLICATIONS_PATH, EGO_JWT_KEY, EGO_LOGIN_URL } from "global/constants";
import Router from 'next/router';
import urlJoin from "url-join";
import { get } from 'lodash';
import queryString from 'query-string';
import { isValidJwt } from "./egoTokenUtils";
import { ClientSideGetInitialPropsContext } from "./pages/types";

export const OAUTH_QUERY_PARAM_NAME = 'isOauth';

export const createLoginRedirectURL = ({
  origin,
  path,
  query,
}: {
  origin: string;
  path: string;
  query?: string;
}): string => {
  if (['/', 'undefined'].includes(path)) {
    return '';
  }
  const mergedQuery = `?${query ? `${query}&` : ''}${OAUTH_QUERY_PARAM_NAME}=true`;
  const redirectUri = `&redirect_uri=${origin}${path}/${encodeURIComponent(mergedQuery)}`;
  return redirectUri;
};

export const makeRedirectPath = (ctxAsPath: string | undefined): string =>
  ctxAsPath ? `/?redirect=${encodeURI(ctxAsPath)}` : '/';

export const createLoginURL = ({
  ctx
}: {
  ctx: ClientSideGetInitialPropsContext
}): string => {
  const redirect = get(ctx.query, 'redirect') as string;
  if (redirect) {
    const parsedRedirect = queryString.parseUrl(redirect);
    const existingQuery = queryString.stringify(parsedRedirect.query);

    const queryRedirect = createLoginRedirectURL({
      origin: location.origin,
      path: parsedRedirect.url,
      query: existingQuery,
    });
    return urlJoin(EGO_LOGIN_URL, queryRedirect);
  } else if (ctx.asPath === '/') {
    return EGO_LOGIN_URL;
  } else {
    const queryString = ctx.asPath?.split('?')[1] || '';
    const pathRoot = ctx.asPath?.split('?')[0] || '';

    const redirect = createLoginRedirectURL({
      origin: location.origin,
      path: pathRoot,
      query: queryString,
    });
    return urlJoin(EGO_LOGIN_URL, redirect);
  }
}

export const fetchEgoToken = (target: string = APPLICATIONS_PATH) => {
  const { NEXT_PUBLIC_EGO_API_ROOT, NEXT_PUBLIC_EGO_CLIENT_ID } = getConfig();
  const egoLoginUrl = urlJoin(
    NEXT_PUBLIC_EGO_API_ROOT,
    `/oauth/ego-token?client_id=${NEXT_PUBLIC_EGO_CLIENT_ID}`,
  );

  fetch(egoLoginUrl, {
    credentials: 'include',
    headers: { accept: '*/*' },
    body: null,
    method: 'POST',
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error();
      }
      return res.text();
    })
    .then((jwt) => {
      if (isValidJwt(jwt)) {
        localStorage.setItem(EGO_JWT_KEY, jwt);
        Router.push(target);
        return jwt;
      }
      throw new Error('Invalid jwt, cannot login.');
    })
    .catch((err) => {
      console.warn(err);
      localStorage.removeItem(EGO_JWT_KEY);
      Router.push('/');
    });
};
