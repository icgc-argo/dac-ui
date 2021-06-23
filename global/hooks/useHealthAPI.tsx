import { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { API } from 'global/constants/externalPaths';
import { getConfig } from 'global/config';

const { NEXT_PUBLIC_DAC_API_ROOT } = getConfig();

const useHealthAPI = () => {
  const [response, setResponse] = useState<AxiosResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | undefined>(undefined);

  useEffect(() => {
    axios.get(API.HEALTH, { baseURL: NEXT_PUBLIC_DAC_API_ROOT })
      .then((res: AxiosResponse | undefined) => {
        setResponse(res);
      })
      .catch((err: AxiosError | undefined) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { error, isLoading, response };
};

export default useHealthAPI;
