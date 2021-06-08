import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import Link from '@icgc-argo/uikit/Link';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';
import React from 'react';
import DashboardCard from '../Card';

const StartApplication = () => {
  const theme = useTheme();
  return (
    <DashboardCard title="Start a new application">
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 65px 0;
        `}
      >
        <Typography
          variant="data"
          css={css`
            margin-bottom: 28px;
            max-width: 520px;
            text-align: center;
          `}
        >
          Start a new application, fill out all required sections, then sign and submit the
          application. The ICGC DACO will review and grant access to{' '}
          <Link>eligible project teams.</Link>
        </Typography>

        <Button onClick={function noRefCheck() {}} size="sm">
          <Icon
            css={css`
              margin-bottom: -2px;
            `}
            fill={theme.colors.white}
            height="12px"
            name="file"
          />
          Start a New Application
        </Button>
      </div>
    </DashboardCard>
  );
};

export default StartApplication;
