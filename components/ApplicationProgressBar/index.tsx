import Progress, { ProgressItem as ProgressItemDefault } from '@icgc-argo/uikit/Progress';
import { styled } from '@icgc-argo/uikit';
import { ApplicationState, ProgressStates } from './types';

const ProgressItem = styled(ProgressItemDefault)`
  min-width: 100px;
`;

const defaultProgressItems = [
  { label: 'Draft', state: 'disabled', completed: false },
  { label: 'Sign & Submit', state: 'disabled', completed: false },
  { label: 'Daco Review', state: 'disabled', completed: false },
];

enum PROGRESS_LABELS {
  DACO_REVIEW = 'DACO Review',
  DRAFT = 'DRAFT',
  SIGN_AND_SUBMIT = 'Sign & Submit',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CLOSED = 'Closed',
  REVISIONS_NEEDED = 'Revisions Needed',
}

const progressStates: ProgressStates = {
  [ApplicationState.DRAFT]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'pending', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'disabled', completed: false },
    { label: PROGRESS_LABELS.DACO_REVIEW, state: 'disabled', completed: false },
  ],
  [ApplicationState.SIGN_AND_SUBMIT]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'pending', completed: true },
    { label: PROGRESS_LABELS.DACO_REVIEW, state: 'disabled', completed: false },
  ],
  [ApplicationState.REVIEW]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.DACO_REVIEW, state: 'pending', completed: true },
  ],
  [ApplicationState.APPROVED]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.APPROVED, state: 'success', completed: true },
  ],
  [ApplicationState.REVISIONS_REQUESTED]: [
    { label: PROGRESS_LABELS.REVISIONS_NEEDED, state: 'pending', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'disabled', completed: false },
    { label: PROGRESS_LABELS.DACO_REVIEW, state: 'disabled', completed: false },
  ],
  [ApplicationState.REJECTED]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'success', completed: true },
    { label: PROGRESS_LABELS.REJECTED, state: 'closed', completed: true },
  ],
  [ApplicationState.CLOSED]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'closed', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'closed', completed: true },
    { label: PROGRESS_LABELS.CLOSED, state: 'closed', completed: true },
  ],
  [ApplicationState.EXPIRED]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'locked', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'closed', completed: true },
    { label: PROGRESS_LABELS.CLOSED, state: 'closed', completed: true },
  ],
  [ApplicationState.RENEWING]: [
    { label: PROGRESS_LABELS.DRAFT, state: 'closed', completed: true },
    { label: PROGRESS_LABELS.SIGN_AND_SUBMIT, state: 'closed', completed: true },
    { label: PROGRESS_LABELS.CLOSED, state: 'closed', completed: true },
  ],
};

const ApplicationProgressBar = ({ state }: { state: ApplicationState }) => {
  const progressItems = state ? progressStates[state] : defaultProgressItems;
  return (
    <div>
      <Progress>
        {progressItems.map(({ label, state, completed }, i) => (
          <ProgressItem key={i} text={label} state={state} completed={completed} />
        ))}
      </Progress>
    </div>
  );
};

export default ApplicationProgressBar;
