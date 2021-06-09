import Button from '@icgc-argo/uikit/Button';
import React from 'react';
import DashboardCard from '../Card';
import { css } from '@emotion/core';
import Typography from '@icgc-argo/uikit/Typography';
import ApplicationProgressBar, { ApplicationState } from 'components/pages/ProgressBar';
import { format as formatDate } from 'date-fns';
import { update } from 'lodash';
import { UikitTheme } from '@icgc-argo/uikit';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

type InProgressProps = {
  applicationNumber: string;
  institution: string;
  state: ApplicationState;
  updatedAtUtc: string;
};

const SIMPLE_DATE_FORMAT = 'MMMM. dd, yyyy';
const TIME_AND_DATE_FORMAT = "MMMM. dd, yyyy 'at' h:m aaaa";

const getStatusText = (state = 1, date = '') => {
  const formattedDate = date ? formatDate(new Date(date), SIMPLE_DATE_FORMAT) : '';

  switch (state) {
    case 1:
      return `Approved on ${formattedDate}. You now have access to ICGC Controlled Data.`;
    case 2:
      return `Created on ${formattedDate}.`;
    case 3:
      return `Submitted on ${formattedDate}. This application is locked for ICGC DACO review.`;
    case 4:
      return `Reopened on ${formattedDate}. Revision details were sent via email.`;
    case 5:
      return `Rejected on ${formattedDate}. This application cannot be reopened, reasons were sent via email.`;
    case 6:
      return `Closed on ${formattedDate}. You can reopen this application at anytime.`;
    case 7:
      `Closed on ${formattedDate}.`;
    default:
      return '';
  }
};
const initState = { appId: '', state: '', submitterId: '', expiresAtUtc: '', updatedAtUtc: '' };

const getButtonConfig = (state = ''): { content: string; link: string; icon: any }[] => {
  switch (state) {
    case ApplicationState.DRAFT:
    case ApplicationState.SIGN_AND_SUBMIT:
    case ApplicationState.REVISIONS_REQUESTED:
      return [
        {
          content: 'Edit Application',
          link: '/application',
          icon: (
            <Icon
              css={css`
                position: relative;
                top: 2px;
              `}
              fill="white"
              height="12px"
              width="12px"
              name="edit"
            />
          ),
        },
      ];
    case ApplicationState.REVIEW:
    case ApplicationState.REJECTED:
    // closed after approval
    case ApplicationState.CLOSED:
      return [
        {
          content: 'View Application',
          link: '',
          icon: <Icon fill="white" height="12px" width="9px" name="file" />,
        },
      ];
    case ApplicationState.APPROVED:
      return [
        {
          content: 'View Application',
          link: '',
          icon: <Icon fill="white" height="12px" width="9px" name="file" />,
        },
        {
          content: 'Manage Collaborators',
          link: '',
          icon: <Icon fill="white" height="12px" width="12px" name="user" />,
        },
      ];
    // closed befoer approval
    case ApplicationState.CLOSED:
      [
        {
          content: 'View Application',
          link: '',
          icon: <Icon fill="white" height="12px" width="9px" name="file" />,
        },
        {
          content: 'Reopen',
          link: '',
          icon: <Icon fill="white" height="12px" width="10px" name="reset" />,
        },
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

  const { appId, submitterId, state, expiresAtUtc, updatedAtUtc } = application;

  const expiryDate =
    expiresAtUtc && `Access Expiry: ${formatDate(new Date(expiresAtUtc), SIMPLE_DATE_FORMAT)}`;

  const updatedAtDate = updatedAtUtc && formatDate(new Date(updatedAtUtc), TIME_AND_DATE_FORMAT);
  const theme = useTheme();

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
            <b>Last Updated:</b> {updatedAtDate}
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
          {getButtonConfig(state).map(({ content, link, icon }) => (
            <Button className="app-btn" size="sm">
              <span
                css={css`
                  margin-right: 3px;
                `}
              >
                {icon}
              </span>
              {content}
            </Button>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export default InProgress;
