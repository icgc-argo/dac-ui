import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse, Method } from 'axios';
import { ApplicationsRequestData } from '../../components/pages/Applications/types';
import useAuthContext from './useAuthContext';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT,
  stringifySort,
  stringifyStates,
} from 'components/pages/Applications/ManageApplications/utils';
import { API } from 'global/constants/externalPaths';

const useApplicationsAPI = ({
  appId = '',
  data,
  method,
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = DEFAULT_SORT,
  states = [],
}: ApplicationsRequestData = {}) => {
  const [response, setResponse] = useState<AxiosResponse | undefined>(undefined);
  const [error, setError] = useState<AxiosError | undefined>(undefined);

  const { fetchWithAuth, isLoading, token } = useAuthContext();

  useEffect(() => {
    if (token && !isLoading) {
      fetchWithAuth({
        data,
        method,
        params: {
          page,
          pageSize,
          sort: stringifySort(sort),
          states: stringifyStates(states),
        },
        url: `${API.APPLICATIONS}/${appId}`,
      })
        .then((res: any) => {
          setResponse(res);
        })
        .catch((err: any) => {
          setError(err);
        });
    }
  }, [page, pageSize, stringifySort(sort)]);

  return { error, isLoading, response };
};

export default useApplicationsAPI;
