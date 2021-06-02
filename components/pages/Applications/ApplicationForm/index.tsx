import { ReactElement } from 'react';

import ApplicationHeader from './Header';
import ApplicationFormsBase from './Forms';

const ApplicationForm = ({ appId = 'none' }): ReactElement => {
  return (
    <>
      <ApplicationHeader appId={appId} />

      <ApplicationFormsBase appId={appId} />
    </>
  );
};

export default ApplicationForm;
