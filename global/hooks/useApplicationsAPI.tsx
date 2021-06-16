import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { ApplicationsRequestData } from '../../components/pages/Applications/types';
import useAuthContext from './useAuthContext';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT,
  stringifySort,
} from 'components/pages/Applications/ManageApplications/utils';
import { API } from 'global/constants/externalPaths';

const useApplicationsAPI = ({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = stringifySort(DEFAULT_SORT),
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
      url: API.APPLICATIONS,
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
