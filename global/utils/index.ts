import { OAUTH_QUERY_PARAM_NAME } from 'global/constants';

export const createRedirectURL = ({
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
  return `&redirect_uri=${origin}${path}${encodeURIComponent(mergedQuery)}`;
};
