import React, { useState } from 'react';
import Progress, { ProgressItem } from '@icgc-argo/uikit/Progress';
import { ApplicationState, defaultProgressState, progressStates } from './progressStates';

const ApplicationProgressBar = ({ state }: { state: ApplicationState }) => {
  console.log('state', state);
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
