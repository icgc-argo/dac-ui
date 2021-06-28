import { ReactElement } from 'react';
import { FORM_STATES } from '../Forms/types';

const ApplicationProgress = ({ state }: { state: FORM_STATES }): ReactElement => (
  <section>{state || 'progress bar here'}</section>
);

export default ApplicationProgress;
