import ProgressBar from 'components/ApplicationProgressBar';
import { ApplicationState } from 'components/ApplicationProgressBar/types';
import React, { ReactElement } from 'react';

const ApplicationProgress = ({ state }: { state: ApplicationState }): ReactElement => (
  <section>
    <ProgressBar state={state} />
  </section>
);

export default ApplicationProgress;
