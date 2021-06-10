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

const tempToken = "eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MTk4MjU1NjUsImV4cCI6MTYzOTgyNzM2NSwic3ViIjoiNDlmZWEyZDMtYmE0MS00OGQ5LWFjMjgtMDUxN2RhYzMwOWEyIiwiaXNzIjoiZWdvIiwianRpIjoiOGE2YzIwMWYtMzBmOS00ZmU5LTkzNjItNzdkOGZlMmZkYTk2IiwiY29udGV4dCI6eyJzY29wZSI6WyJEQUNPLVJFVklFVy5XUklURSJdLCJ1c2VyIjp7Im5hbWUiOiJiYWxsYWJhZGlAb2ljci5vbi5jYSIsImVtYWlsIjoiYmFsbGFiYWRpQG9pY3Iub24uY2EiLCJzdGF0dXMiOiJBUFBST1ZFRCIsImZpcnN0TmFtZSI6IkJhc2hhciIsImxhc3ROYW1lIjoiQWxsYWJhZGkiLCJjcmVhdGVkQXQiOjE1ODMzNDIyOTE3NDUsImxhc3RMb2dpbiI6MTYxOTgyNTU2NTY1MSwicHJlZmVycmVkTGFuZ3VhZ2UiOm51bGwsInR5cGUiOiJBRE1JTiIsImdyb3VwcyI6WyJiMDQ3MTM3OC00ZjFjLTQ1ZWYtOTc1Yi01NTIxMDY3ZjY1MjQiXX19LCJhdWQiOltdfQ.VlYdIOB9H0T37iVk4h9syE8ZBX5AvnHWKlJvq_OqmVWiQEpY1a9EW3SIWyhP-MgrYeThNIrcmR5gCsZrWU5-IST49kkk_nDPOMwKHKUBEdHV8y7wdgx7NjpRl2prQvQhukXMTbMfayHI9xwjSOWT80APVJSvAgh6kbQdmn5pyDQKfRN5CBE8VHI3ptV-pMOWmfyQBSp2AydBTewku24Fg2CmVwekF_bEg24xoZdEEC0CE3K6Aey6662aGY7c8fm5JdsrlVGbX_ugqd552-dho8jUI7oGOf4mwEdSiXO1gdDqeNqnvpTwRCX1r-Vou8zY7DDwVf9kkZpdi6hemJZROA";

const useAxios = ({
  params = {},
  headers = {},
  method = 'GET' as Method,
  url = '/',
}: AxiosRequestConfig) => {
  const [error, setError] = useState<AxiosError | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<AxiosResponse | undefined>();

  // TODO PUT THIS BACK LATER
  // const { token } = useAuthContext();

  const config: AxiosRequestConfig = {
    params,
    headers: {
      accept: '*/*',
      ...headers,
      // TODO PUT THIS BACK LATER
      // Authorization: `Bearer ${token || ''}`,
      Authorization: `Bearer ${tempToken}`
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
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  return { error, isLoading, response };
};

export default useAxios;
