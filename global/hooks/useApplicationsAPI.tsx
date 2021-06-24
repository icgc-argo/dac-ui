import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
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

export const useApplicationsAPI = ({
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
  const [isLoadingApplications, setIsLoadingApplications] = useState<boolean>(true)

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
        })
        .finally(() => {
          setIsLoadingApplications(false);
        })
    }
  }, [page, pageSize, stringifySort(sort)]);

  return { error, isLoadingApplications, response };
};

export const useSubmitApplication = ({
  appId = '',
  data,
  method,
  params,
}: ApplicationsRequestData = {}) => {
  const [response, setResponse] = useState<AxiosResponse | undefined>(undefined);
  const [error, setError] = useState<AxiosError | undefined>(undefined);
  const [isLoadingApplications, setIsLoadingApplications] = useState<boolean>(true)

  const { fetchWithAuth } = useAuthContext();

  const onSubmit = () => {
    fetchWithAuth({
      data,
      method,
      params,
      url: `${API.APPLICATIONS}/${appId}`,
    })
      .then((res: any) => {
        setResponse(res);
      })
      .catch((err: any) => {
        setError(err);
      })
      .finally(() => {
        setIsLoadingApplications(false);
      })
  };

  return { error, isLoadingApplications, onSubmit, response };
};
