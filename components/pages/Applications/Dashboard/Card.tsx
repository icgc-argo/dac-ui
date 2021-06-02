import { css } from '@icgc-argo/uikit';
import Icon from '@icgc-argo/uikit/Icon';
import { ContentBody, ContentBox } from '@icgc-argo/uikit/PageLayout';
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
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
      `}
    >
      <header
        css={css`
          align-items: center;
          border-bottom: 1px solid ${theme.colors.grey_2};
          height: 60px;
          display: flex;
          padding: 0 40px;
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
