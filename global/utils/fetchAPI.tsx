import axios, { AxiosRequestConfig, Method } from 'axios';
import urlJoin from 'url-join';

import { DAC_API } from 'global/constants/externalPaths';
import { getConfig } from 'global/config';
import useAuthContext from 'global/hooks/useAuthContext';

const { USE_DAC_API_PROXY } = getConfig();

axios.defaults.baseURL = USE_DAC_API_PROXY ? '' : DAC_API;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const fetchAPI = ({
  params = {},
  headers = {},
  method = 'GET' as Method,
  url = '/',
}: AxiosRequestConfig) => {
  const { token } = useAuthContext();
  const config: AxiosRequestConfig = {
    params,
    headers: {
      accept: '*/*',
      ...headers,
      Authorization: `Bearer ${token || ''}`,
    },
    method,
    url: USE_DAC_API_PROXY ? urlJoin('/api', url) : url,
  }

  return axios(config)
    // TODO log errors somewhere?
    .catch(error => {
      console.error({ error });
    });
};

export default fetchAPI;
