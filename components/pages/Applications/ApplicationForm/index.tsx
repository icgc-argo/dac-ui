import { ReactElement, useEffect, useState } from 'react';
import { Method, AxiosResponse, AxiosError } from 'axios';
import urlJoin from 'url-join';

import Loader from 'components/Loader';
import { useAuthContext } from 'global/hooks';
import { API } from 'global/constants';
import ContentError from 'components/placeholders/ContentError';

import ApplicationHeader from './Header';
import ApplicationFormsBase from './Forms';
import RequestRevisionsBar from './RequestRevisionsBar';

const ApplicationForm = ({ appId = 'none', isAdmin = false }): ReactElement => {
  const [data, setData] = useState<AxiosResponse | undefined>(undefined);
  const [error, setError] = useState<AxiosError | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>(undefined);

  const { fetchWithAuth } = useAuthContext();

  useEffect(() => {
    fetchWithAuth({
      method: 'GET' as Method,
      appId,
      url: urlJoin(API.APPLICATIONS, appId),
    })
      .then((res: AxiosResponse) => {
        setData(res.data);
      })
      .catch((err: AxiosError) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [lastUpdated]);

  return error
    ? <ContentError />
    : isLoading || data && Object.values(data).length < 1 ? (
      <Loader />
    ) : (
      <>
        <ApplicationHeader data={data} />
        {isAdmin && <RequestRevisionsBar data={data} />}
        <ApplicationFormsBase appId={appId} setLastUpdated={setLastUpdated} />
      </>
    );
};

export default ApplicationForm;
