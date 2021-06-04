import { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

import { DAC_API } from 'global/constants/externalPaths';

import useAuthContext from './useAuthContext';

axios.defaults.baseURL = DAC_API;

const useAxios = ({
  data = {},
  headers = {},
  method = 'GET',
  url = '/',
}: AxiosRequestConfig) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState({});

  const { token } = useAuthContext();

  const config: AxiosRequestConfig = {
    data,
    headers: {
      accept: '*/*',
      ...headers,
      Authorization: `Bearer ${token || ''}`
    },
    method,
    url,
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
  }, [data, headers, method, url]);

  return { error, loading, response };
};

export default useAxios;
