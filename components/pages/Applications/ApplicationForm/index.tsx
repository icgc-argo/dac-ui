import { ReactElement, useEffect, useState } from 'react';

import { API } from 'global/constants';
import { useAuthContext } from 'global/hooks';

import ApplicationHeader from './Header';
import ApplicationFormsBase from './Forms';
import RequestRevisionsBar from './RequestRevisionsBar';

import DnaLoader from '@icgc-argo/uikit/DnaLoader';

const ApplicationForm = ({ appId = 'none', isAdmin = false }): ReactElement => {
  const [appData, setAppData] = useState({});
  const { fetchWithAuth, isLoading } = useAuthContext();

  useEffect(() => {
    fetchWithAuth({
      url: `${API.APPLICATIONS}/${appId}`,
    })
      .then(({ data }: { data: Record<string, any> }) => setAppData(data))
      .catch((error: Error) => {
        // TODO dev logging, errors should not be shown to user
        console.error(error);
      });
  }, []);

  return isLoading || Object.values(appData).length < 1 ? (
    <DnaLoader />
  ) : (
    <>
      <ApplicationHeader data={appData} />
      {isAdmin && <RequestRevisionsBar appId={appId} />}
      <ApplicationFormsBase appId={appId} />
    </>
  );
};

export default ApplicationForm;
