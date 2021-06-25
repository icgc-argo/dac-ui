import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse, Method } from 'axios';
import urlJoin from 'url-join';
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

// use this for simple "get application(s) on render" fetch requests.

const useGetApplications = ({
  appId = '',
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = DEFAULT_SORT,
  states = [],
}: ApplicationsRequestData = {}) => {
  const [response, setResponse] = useState<AxiosResponse | undefined>(undefined);
  const [error, setError] = useState<AxiosError | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { fetchWithAuth, isLoading: isTokenLoading, token } = useAuthContext();

  useEffect(() => {
    if (token && !isTokenLoading) {
      fetchWithAuth({
        method: 'GET' as Method,
        ...appId ? {} : {
          params: {
            page,
            pageSize,
            sort: stringifySort(sort),
            states: stringifyStates(states),
          }
        },
        url: urlJoin(API.APPLICATIONS, appId),
      })
        .then((res: AxiosResponse) => {
          setResponse(res);
        })
        .catch((err: AxiosError) => {
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        })
    }
  }, [page, pageSize, stringifySort(sort)]);

  return { error, isLoading, response };
};

export default useGetApplications;
