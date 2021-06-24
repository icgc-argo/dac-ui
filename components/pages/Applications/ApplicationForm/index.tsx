import { ReactElement, useEffect, useState } from 'react';

import Loader from 'components/Loader';
import { useApplicationsAPI } from 'global/hooks';

import ApplicationHeader from './Header';
import ApplicationFormsBase from './Forms';
import RequestRevisionsBar from './RequestRevisionsBar';

const ApplicationForm = ({ appId = 'none', isAdmin = false }): ReactElement => {
  const [appData, setAppData] = useState({});
  const { response, isLoading } = useApplicationsAPI({ appId });

  useEffect(() => {
    response && setAppData(response.data);
  }, [response]);

  return isLoading || Object.values(appData).length < 1 ? (
    <Loader />
  ) : (
    <>
      <ApplicationHeader data={appData} />
      {isAdmin && <RequestRevisionsBar appId={appId} />}
      <ApplicationFormsBase appId={appId} />
    </>
  );
};

export default ApplicationForm;
