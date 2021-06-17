import { ReactElement } from 'react';

import ApplicationHeader from './Header';
import ApplicationFormsBase from './Forms';
import RequestRevisionsBar from './RequestRevisionsBar';

const ApplicationForm = ({ appId = 'none', isAdmin = false }): ReactElement => {
  return (
    <>
      <ApplicationHeader appId={appId} />
      {isAdmin && <RequestRevisionsBar appId={appId} />}
      <ApplicationFormsBase appId={appId} />
    </>
  );
};

export default ApplicationForm;
