import { ReactElement } from 'react';

import ApplicationHeader from './Header';
import ApplicationFormsBase from './Forms';

const ApplicationForm = ({ ID='none' }): ReactElement => {
  return (
    <>
      <ApplicationHeader ID={ID} />

      <ApplicationFormsBase />
    </>
  );
}

export default ApplicationForm;