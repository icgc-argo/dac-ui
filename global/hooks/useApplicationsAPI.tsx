import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { APPLICATIONS_PATH } from 'global/constants/internalPaths';
import { ApplicationsRequestData } from '../../components/pages/Applications/types';
import useAuthContext from './useAuthContext';

const useApplicationsAPI = ({
  page,
  pageSize,
  sort,
}: // method
// id
// ...etc
ApplicationsRequestData) => {
  const [response, setResponse] = useState<AxiosResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | undefined>(undefined);

  const { fetchWithAuth } = useAuthContext();

  useEffect(() => {
    fetchWithAuth({
      params: {
        page,
        pageSize,
        sort,
      },
      url: APPLICATIONS_PATH,
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
  }, [page, pageSize, sort]);

  return { error, isLoading, response };
};

export default useApplicationsAPI;
