// login, redirect on login, refresh token, etc

import { getConfig } from "global/config";
import { APPLICATIONS_PATH, EGO_JWT_KEY } from "global/constants";
import Router from 'next/router';
import urlJoin from "url-join";
import { isValidJwt } from "./egoTokenUtils";

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
