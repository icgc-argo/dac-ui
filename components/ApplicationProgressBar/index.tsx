import Progress, { ProgressItem as ProgressItemDefault } from '@icgc-argo/uikit/Progress';
import { ApplicationState, defaultProgressItems, progressStates } from './progressStates';
import { styled } from '@icgc-argo/uikit';

const ProgressItem = styled(ProgressItemDefault)`
  min-width: 100px;
`;

const ApplicationProgressBar = ({ state }: { state: ApplicationState }) => {
  const progressItems = state ? progressStates[state] : defaultProgressItems;
  return (
    <div>
      <Progress>
        {progressItems.map(({ label, state, completed }) => (
          <ProgressItem text={label} state={state} completed={completed} />
        ))}
      </Progress>
    </div>
  );
};

export default ApplicationProgressBar;
