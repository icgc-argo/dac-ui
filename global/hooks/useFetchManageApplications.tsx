import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { APPLICATIONS_PATH } from 'global/constants/internalPaths';
import { ManageApplicationsRequestData } from '../../components/pages/Applications/ManageApplications/types';
import useAxiosFn from './useAxiosFn';

const useFetchManageApplications = ({
  page,
  pageSize,
  sortString,
}: ManageApplicationsRequestData) => {
  const [response, setResponse] = useState<AxiosResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<AxiosError | undefined>(undefined)

  useEffect(() => {
    useAxiosFn({
      params: {
        page,
        pageSize,
        sort: sortString,
      },
      url: APPLICATIONS_PATH
    })
      .then((res: any) => {
        setResponse(res);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false)
      });
  }, [page, pageSize, sortString]);

  return { error, isLoading, response };
};

export default useFetchManageApplications;
