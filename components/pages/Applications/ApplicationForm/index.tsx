import { ReactElement, useEffect, useState } from 'react';

import Loader from 'components/Loader';
import { useGetApplications } from 'global/hooks';

import ApplicationHeader from './Header';
import ApplicationFormsBase from './Forms';
import RequestRevisionsBar from './RequestRevisionsBar';

const ApplicationForm = ({ appId = 'none', isAdmin = false }): ReactElement => {
  const [appData, setAppData] = useState({});
  const { response, isLoading } = useGetApplications({ appId });

  useEffect(() => {
    response && setAppData(response.data);
  }, [response]);

  return isLoading || Object.values(appData).length < 1 ? (
    <Loader />
  ) : (
    <>
      <ApplicationHeader data={appData} />
      {isAdmin && <RequestRevisionsBar data={appData} />}
      <ApplicationFormsBase appId={appId} setAppData={setAppData} />
    </>
  );
};

export default ApplicationForm;
