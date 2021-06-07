export enum ApplicationState {
  DRAFT = 'DRAFT',
  SIGN_AND_SUBMIT = 'SIGN AND SUBMIT',
  REVIEW = 'REVIEW',
  REVISIONS_REQUESTED = 'REVISIONS REQUESTED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  RENEWING = 'RENEWING',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

interface ProgressState {
  label: string;
  state: string;
  completed: boolean;
}

export const defaultProgressItems = [
  { label: 'Draft', state: 'disabled', completed: false },
  { label: 'Sign & Submit', state: 'disabled', completed: false },
  { label: 'Daco Review', state: 'disabled', completed: false },
];

interface ProgressStates {
  [key: string]: ProgressState[];
}

export const progressStates: ProgressStates = {
  [ApplicationState.DRAFT]: [
    { label: 'Draft', state: 'pending', completed: true },
    { label: 'Sign & Submit', state: 'disabled', completed: false },
    { label: 'Daco Review', state: 'disabled', completed: false },
  ],
  [ApplicationState.SIGN_AND_SUBMIT]: [
    { label: 'Draft', state: 'success', completed: true },
    { label: 'Sign & Submit', state: 'pending', completed: true },
    { label: 'Daco Review', state: 'disabled', completed: false },
  ],
  [ApplicationState.REVIEW]: [
    { label: 'Draft', state: 'success', completed: true },
    { label: 'Sign & Submit', state: 'success', completed: true },
    { label: 'Daco Review', state: 'pending', completed: true },
  ],
  [ApplicationState.APPROVED]: [
    { label: 'Draft', state: 'success', completed: true },
    { label: 'Sign & Submit', state: 'success', completed: true },
    { label: 'Approved', state: 'success', completed: true },
  ],
  [ApplicationState.REVISIONS_REQUESTED]: [
    { label: 'Revisions Needed', state: 'pending', completed: true },
    { label: 'Sign & Submit', state: 'disabled', completed: false },
    { label: 'Daco Review', state: 'disabled', completed: false },
  ],
  [ApplicationState.REJECTED]: [
    { label: 'Draft', state: 'success', completed: true },
    { label: 'Sign & Submit', state: 'success', completed: true },
    { label: 'Rejected', state: 'locked', completed: true },
  ],
  [ApplicationState.CLOSED]: [
    { label: 'Draft', state: 'locked', completed: true },
    { label: 'Sign & Submit', state: 'locked', completed: true },
    { label: 'Closed', state: 'locked', completed: true },
  ],
  [ApplicationState.EXPIRED]: [
    { label: 'Draft', state: 'locked', completed: true },
    { label: 'Sign & Submit', state: 'locked', completed: true },
    { label: 'Closed', state: 'locked', completed: true },
  ],

  [ApplicationState.RENEWING]: [
    { label: 'Draft', state: 'locked', completed: true },
    { label: 'Sign & Submit', state: 'locked', completed: true },
    { label: 'Closed', state: 'locked', completed: true },
  ],
};
