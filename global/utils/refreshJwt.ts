import urlJoin from 'url-join';
import { getConfig } from 'global/config';
import { EGO_JWT_KEY } from 'global/constants';
import { isValidJwt } from './egoTokenUtils';
import Queue from 'promise-queue';

const { NEXT_PUBLIC_EGO_API_ROOT, NEXT_PUBLIC_EGO_CLIENT_ID } = getConfig();

var maxConcurrent = 1;
var maxQueue = Infinity;
var queue = new Queue(maxConcurrent, maxQueue);

// pass client_id to get ego api to set correct response headers
const refreshUrl = urlJoin(
  NEXT_PUBLIC_EGO_API_ROOT,
  `/api/oauth/refresh?client_id=${NEXT_PUBLIC_EGO_CLIENT_ID}`,
);

export default () =>
  queue.add(() => {
    return fetch(refreshUrl, {
      credentials: 'include',
      headers: {
        accept: '*/*',
        authorization: localStorage.get(EGO_JWT_KEY) || '',
      },
      method: 'POST',
    })
      .then((res) => res.text())
      .then((newJwt) => {
        if (isValidJwt(newJwt)) {
          localStorage.set(EGO_JWT_KEY, newJwt);
        }
        return newJwt;
      });
  });
