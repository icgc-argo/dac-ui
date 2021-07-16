import DashboardCard from '../../Card';
import { css } from '@emotion/core';
import Typography from '@icgc-argo/uikit/Typography';
import ProgressBar from '../../../../../ApplicationProgressBar';
import { TIME_AND_DATE_FORMAT } from './constants';
import { getFormattedDate, getStatusText } from './helpers';
import ButtonGroup from './ButtonGroup';
import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { DATE_TEXT_FORMAT } from 'global/constants';
import { ApplicationsResponseItem } from 'components/pages/Applications/types';
import { pick } from 'lodash';

export interface StatusDates {
  lastUpdatedAtUtc: string;
  createdAtUtc: string;
  submittedAtUtc: string;
  closedAtUtc: string;
  approvedAtUtc: string;
}

const InProgress = ({ application }: { application: ApplicationsResponseItem }) => {
  const {
    appId,
    applicant: {
      info: { primaryAffiliation },
    },
    state,
    expiresAtUtc,
    lastUpdatedAtUtc,
  } = application;

  const dates: StatusDates = {
    lastUpdatedAtUtc,
    ...pick(application, ['createdAtUtc', 'submittedAtUtc', 'closedAtUtc', 'approvedAtUtc']),
  };

  const expiryDate = expiresAtUtc
    ? `Access Expiry: ${getFormattedDate(expiresAtUtc, DATE_TEXT_FORMAT)}`
    : '';

  return (
    <DashboardCard title={`Application: ${appId}`} subtitle={primaryAffiliation} info={expiryDate}>
      <div
        css={css`
          margin-top: 5px;
        `}
      >
        <ProgressBar state={state as ApplicationState} />

        <Typography
          variant="data"
          as="div"
          css={css`
            margin-top: 28px;
          `}
        >
          <div
            css={css`
              margin-bottom: 5px;
            `}
          >
            <b>Status:</b> {getStatusText(state as ApplicationState, dates)}
          </div>
          <div>
            <b>Last Updated:</b> {getFormattedDate(lastUpdatedAtUtc, TIME_AND_DATE_FORMAT)}
          </div>
        </Typography>

        <ButtonGroup appId={appId} state={state as ApplicationState} />
      </div>
    </DashboardCard>
  );
};

export default InProgress;
