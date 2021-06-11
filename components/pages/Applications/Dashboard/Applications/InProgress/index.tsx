import React from 'react';
import DashboardCard from '../../Card';
import { css } from '@emotion/core';
import Typography from '@icgc-argo/uikit/Typography';
import ProgressBar from '../../../../../ApplicationProgressBar';
import { SIMPLE_DATE_FORMAT, TIME_AND_DATE_FORMAT } from './constants';
import { getFormattedDate, getStatusText } from './helpers';
import ButtonGroup from './ButtonGroup';

const initState = { appId: '', state: '', submitterId: '', expiresAtUtc: '', updatedAtUtc: '' };

const InProgress = ({}) => {
  const { appId, submitterId: primaryAffliation, state, expiresAtUtc, updatedAtUtc } = application;

  const expiryDate = `Access Expiry: ${getFormattedDate(expiresAtUtc, SIMPLE_DATE_FORMAT)}`;

  return (
    <DashboardCard
      title={`Application: DACO-${appId}`}
      subtitle={primaryAffliation}
      info={expiryDate}
    >
      <div
        css={css`
          padding: 24px;
        `}
      >
        <ProgressBar state={state} />

        <Typography
          variant="data"
          as="div"
          css={css`
            margin-top: 18px;
          `}
        >
          <div>
            <b>Status:</b> {getStatusText(state, expiresAtUtc)}
          </div>
          <div>
            <b>Last Updated:</b> {getFormattedDate(updatedAtUtc, TIME_AND_DATE_FORMAT)}
          </div>
        </Typography>

        <ButtonGroup state={state} />
      </div>
    </DashboardCard>
  );
};

export default InProgress;
