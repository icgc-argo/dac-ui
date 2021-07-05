export { ApplicationState } from 'components/pages/Applications/types';

export interface ProgressState {
  label: string;
  state: string;
  completed: boolean;
}

export interface ProgressStates {
  [key: string]: ProgressState[];
}
