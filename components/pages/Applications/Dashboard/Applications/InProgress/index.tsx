import React from 'react';
import DashboardCard from '../../Card';
import { css } from '@emotion/core';
import Typography from '@icgc-argo/uikit/Typography';
import ProgressBar from '../../../../../ApplicationProgressBar';
import { TIME_AND_DATE_FORMAT } from './constants';
import { getFormattedDate, getStatusText } from './helpers';
import ButtonGroup from './ButtonGroup';
import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { DATE_TEXT_FORMAT } from 'global/constants';

const initState = {
  appId: '1',
  state: ApplicationState.DRAFT,
  submitterId: 'Ontario Institute for Cancer Research',
  expiresAtUtc: '2021-06-16T18:10:13.760Z',
  updatedAtUtc: '2021-06-16T18:10:13.760Z',
};

const InProgress = ({ application }: { application: any }) => {
  const { appId, submitterId: primaryAffiliation, state, expiresAtUtc, updatedAtUtc } = initState;

  const expiryDate = expiresAtUtc
    ? `Access Expiry: ${getFormattedDate(expiresAtUtc, DATE_TEXT_FORMAT)}`
    : '';

  return (
    <DashboardCard
      title={`Application: DACO-${appId}`}
      subtitle={primaryAffiliation}
      info={expiryDate}
    >
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
            <b>Status:</b> {getStatusText(state as ApplicationState, expiresAtUtc)}
          </div>
          <div>
            <b>Last Updated:</b> {getFormattedDate(updatedAtUtc, TIME_AND_DATE_FORMAT)}
          </div>
        </Typography>

        <ButtonGroup state={state as ApplicationState} />
      </div>
    </DashboardCard>
  );
};

export default InProgress;
