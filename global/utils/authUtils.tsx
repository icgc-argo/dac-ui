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
  console.log('📍 MAKING REDIRECT URL')
  if (['/', 'undefined'].includes(path)) {
    console.log('📍 no redirect URL for you')
    return '';
  }
  const mergedQuery = `?${query ? `${query}&` : ''}${OAUTH_QUERY_PARAM_NAME}=true`;
  const redirectUri = `&redirect_uri=${origin}${path}${encodeURIComponent(mergedQuery)}`;
  console.log('📍 mergedQuery', mergedQuery);
  console.log('📍 redirectUri', redirectUri);
  return redirectUri;
};
