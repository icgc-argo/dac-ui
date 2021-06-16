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

const progressStates: ProgressStates = {
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
    { label: 'Rejected', state: 'closed', completed: true },
  ],
  [ApplicationState.CLOSED]: [
    { label: 'Draft', state: 'closed', completed: true },
    { label: 'Sign & Submit', state: 'closed', completed: true },
    { label: 'Closed', state: 'closed', completed: true },
  ],
  [ApplicationState.EXPIRED]: [
    { label: 'Draft', state: 'locked', completed: true },
    { label: 'Sign & Submit', state: 'closed', completed: true },
    { label: 'Closed', state: 'closed', completed: true },
  ],
  [ApplicationState.RENEWING]: [
    { label: 'Draft', state: 'closed', completed: true },
    { label: 'Sign & Submit', state: 'closed', completed: true },
    { label: 'Closed', state: 'closed', completed: true },
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
