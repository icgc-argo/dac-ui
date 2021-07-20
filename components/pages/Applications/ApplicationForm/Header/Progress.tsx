import { ReactElement } from 'react';
import ProgressBar from 'components/ApplicationProgressBar';
import { ApplicationState } from 'components/ApplicationProgressBar/types';

const ApplicationProgress = ({ state }: { state: ApplicationState }): ReactElement => (
  <section>
    <ProgressBar state={state} />
  </section>
);

export default ApplicationProgress;
