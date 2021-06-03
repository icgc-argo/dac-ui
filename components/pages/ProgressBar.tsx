import Progress, { ProgressItem } from '@icgc-argo/uikit/Progress';
import React from 'react';

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

const ApplicationProgressBar = ({ state }: { state: ApplicationState }) => (
  <Progress>
    <ProgressItem state="success" text="d" />
    <ProgressItem state="success" text="d" />
    <ProgressItem state="success" text="d" />
  </Progress>
);

export default ApplicationProgressBar;
