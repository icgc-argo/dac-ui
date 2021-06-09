import Button from '@icgc-argo/uikit/Button';
import React from 'react';
import DashboardCard from '../Card';
import { css } from '@emotion/core';
import Typography from '@icgc-argo/uikit/Typography';
import ApplicationProgressBar, { ApplicationState } from 'components/pages/ProgressBar';
import { format as formatDate } from 'date-fns';

type InProgressProps = {
  applicationNumber: string;
  institution: string;
  state: ApplicationState;
};

const EXPIRY_DATE_FORMAT = 'MMMM. dd, yyyy';

const getStatusText = () =>
  'Approved on May. 28, 2021. You now have access to ICGC Controlled Data.';

const initState = { appId: '', state: '', submitterId: '', expiresAtUtc: '' };

const getButtonConfig = (state = ''): { content: string; link: string; icon: string }[] => {
  switch (state) {
    case ApplicationState.DRAFT:
    case ApplicationState.SIGN_AND_SUBMIT:
    case ApplicationState.REVISIONS_REQUESTED:
      return [{ content: 'Edit Application', link: '/application', icon: 'edit' }];
    case ApplicationState.REVIEW:
    case ApplicationState.REJECTED:
    // closed after approval
    case ApplicationState.CLOSED:
      return [{ content: 'View Application', link: '', icon: 'file' }];
    case ApplicationState.APPROVED:
      return [
        { content: 'View Application', link: '', icon: 'file' },
        { content: 'Manage Collaborators', link: '', icon: 'user' },
      ];
    // closed befoer approval
    case ApplicationState.CLOSED:
      [
        { content: 'View Application', link: '', icon: 'file' },
        { content: 'Reopen', link: '', icon: 'reset' },
      ];
  }

  return [];
};

const InProgress = ({}) => {
  const [application, setApplication] = React.useState(initState);
  React.useEffect(() => {
    fetch('http://localhost:3004/applications')
      .then((data) => data.json())
      //.then((d) => console.log(d))
      .then((d) => setApplication(d[0]))
      .catch((e) => console.error(e));
  }, []);

  const { appId, submitterId, state, expiresAtUtc } = application;

  const expiryDate =
    expiresAtUtc && `Access Expiry: ${formatDate(new Date(expiresAtUtc), EXPIRY_DATE_FORMAT)}`;

  return (
    <DashboardCard title={`Application: DACO-${appId}`} subtitle={submitterId} info={expiryDate}>
      <div
        css={css`
          padding: 24px;
        `}
      >
        <ApplicationProgressBar state={state as ApplicationState} />

        <Typography
          variant="data"
          as="div"
          css={css`
            margin-top: 18px;
          `}
        >
          <div>
            <b>Status:</b> {getStatusText()}
          </div>
          <div>
            <b>Last Updated:</b> May. 28, 2021 at 10:22 p.m.
          </div>
        </Typography>

        <div
          css={css`
            margin-top: 18px;
            display: flex;

            &.appbtn {
            }
          `}
        >
          {getButtonConfig(state).map(({ content, link }) => (
            <Button className="app-btn">{content}</Button>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export default InProgress;
