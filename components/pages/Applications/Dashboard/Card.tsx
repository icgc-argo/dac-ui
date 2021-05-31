import { css } from '@emotion/core';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';
import React from 'react';

type DashboardCardProps = {
  Icon?: any;
  title: string;
  subtitle?: string;
  info?: string;
  children: React.ReactNode;
};

const DashboardCard = ({ title, subtitle, info, children }: DashboardCardProps) => {
  const theme = useTheme();

  return (
    <div>
      <header
        css={css`
          align-items: center;
          border-bottom: 1px solid ${theme.colors.grey_2};
          height: 60px;
          display: flex;
          padding: 0 40px;
          margin: 0 -8px;
        `}
      >
        <Typography
          component="h1"
          css={css`
            margin: 0;
          `}
          variant="subtitle"
        >
          <Icon
            css={css`
              margin-bottom: -5px;
              margin-right: 8px;
            `}
            fill={theme.colors.secondary}
            name="form"
          />
          {title}
        </Typography>
      </header>

      {children}
    </div>
  );
};

export default DashboardCard;
