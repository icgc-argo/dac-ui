import { ApplicationState } from 'components/ApplicationProgressBar/progressStates';

export interface InProgressProps {
  applicationNumber: string;
  institution: string;
  state: ApplicationState;
  updatedAtUtc: string;
}
