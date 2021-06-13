import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { APPLICATIONS_PATH } from 'global/constants/internalPaths';
import fetchAPI from 'global/utils/fetchAPI';
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
  const { token } = useAuthContext();

  useEffect(() => {
    fetchAPI({
      params: {
        page,
        pageSize,
        sort,
      },
      url: APPLICATIONS_PATH,
      token,
    })
      .then((res: any) => {
        setResponse(res);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, pageSize, sort, token]);

  return { error, isLoading, response };
};

export default useApplicationsAPI;
