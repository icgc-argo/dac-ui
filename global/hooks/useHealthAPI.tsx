import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import useAuthContext from './useAuthContext';
import { API } from 'global/constants/externalPaths';

const useHealthAPI = () => {
  const [response, setResponse] = useState<AxiosResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | undefined>(undefined);

  const { fetchWithAuth } = useAuthContext();

  useEffect(() => {
    fetchWithAuth({
      method: 'GET',
      url: API.HEALTH,
    })
      .then((res: any) => {
        setResponse(res);
      })
      .catch((err: any) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { error, isLoading, response };
};

export default useHealthAPI;
