// login, redirect on login, refresh token, etc

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
  const redirectUri = `&redirect_uri=${origin}${path}${encodeURIComponent(mergedQuery)}`;
  return redirectUri;
};
