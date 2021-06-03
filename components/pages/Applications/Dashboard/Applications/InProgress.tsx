import Button from '@icgc-argo/uikit/Button';
import React from 'react';
import DashboardCard from '../Card';
import { css } from '@icgc-argo/uikit';
import Typography from '@icgc-argo/uikit/Typography';
import ApplicationProgressBar, { ApplicationState } from 'components/pages/ProgressBar';

type InProgressProps = {
  applicationNumber: string;
  institution: string;
  state: ApplicationState;
};

const InProgress = ({
  applicationNumber = 'DACO-XXXXXX',
  institution = 'Institution: to be specified',
  state,
}: InProgressProps) => (
  <DashboardCard
    title={`Application: ${applicationNumber}`}
    subtitle={institution}
    info={`Access Expiry: May. 28, 2022`}
  >
    <div
      css={css`
        padding: 24px;
      `}
    >
      <ApplicationProgressBar state={ApplicationState.DRAFT} />

      <Typography variant="data">
        <div>Status:</div>
        <div>Last Updated:</div>
      </Typography>

      <div>
        <Button>View Application</Button>
      </div>
    </div>
  </DashboardCard>
);

export default InProgress;
