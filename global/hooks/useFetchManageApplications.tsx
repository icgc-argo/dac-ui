import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { APPLICATIONS_PATH } from 'global/constants/internalPaths';
import fetchAPI from 'global/utils/fetchAPI';
import { ManageApplicationsRequestData } from '../../components/pages/Applications/ManageApplications/types';

const useFetchManageApplications = ({
  page,
  pageSize,
  sort,
}: ManageApplicationsRequestData) => {
  const [response, setResponse] = useState<AxiosResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<AxiosError | undefined>(undefined)

  useEffect(() => {
    fetchAPI({
      params: {
        page,
        pageSize,
        sort,
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
  }, [page, pageSize, sort]);


  return { error, isLoading, response };
};

export default useFetchManageApplications;
