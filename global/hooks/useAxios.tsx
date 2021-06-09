import { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import urlJoin from 'url-join';

import { DAC_API } from 'global/constants/externalPaths';
import { getConfig } from 'global/config';

import useAuthContext from './useAuthContext';

const { USE_DAC_API_PROXY } = getConfig();

axios.defaults.baseURL = USE_DAC_API_PROXY ? '' : DAC_API;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const useAxios = ({
  params = {},
  headers = {},
  method = 'GET' as Method,
  url = '/',
}: AxiosRequestConfig) => {
  const [error, setError] = useState<AxiosError | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<AxiosResponse | undefined>();

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

  const fetchAPI = () => {
    axios(config)
      .then(res => {
        setResponse(res)
      }).catch(err => {
        setError(err);
      }).finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  return { error, loading, response };
};

export default useAxios;
