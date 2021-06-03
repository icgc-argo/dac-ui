import React from 'react';
import Progress, { ProgressItem } from '@icgc-argo/uikit/Progress';

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

const ApplicationProgressBar = ({ state }: { state: ApplicationState }) => {
  console.log('state', state);
  return (
    <div>
      <Progress>
        <ProgressItem state="success" text="a" />
        <ProgressItem state="success" text="a" />
        <ProgressItem state="success" text="a" />
      </Progress>
    </div>
  );
};

export default ApplicationProgressBar;
