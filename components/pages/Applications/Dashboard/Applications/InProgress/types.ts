import { ApplicationState } from 'components/ApplicationProgressBar/types';

export interface InProgressProps {
  applicationNumber: string;
  institution: string;
  state: ApplicationState;
  updatedAtUtc: string;
}
