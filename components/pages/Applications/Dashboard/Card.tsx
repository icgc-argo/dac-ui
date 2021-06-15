import { css } from '@icgc-argo/uikit';
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
          min-height: 60px;
          align-items: center;
          box-sizing: border-box;
          border-bottom: 1px solid ${theme.colors.grey_2};
          display: flex;
          padding: 8px 22px;
        `}
      >
        <Icon
          css={css`
            margin-right: 8px;
          `}
          width="30px"
          height="30px"
          fill={theme.colors.secondary}
          name="form"
        />
        <div>
          <Typography
            component="h1"
            css={css`
              margin: 0;
            `}
            variant="subtitle"
          >
            {title}
          </Typography>
          <Typography
            css={css`
              padding: 0;
              margin: 0;
              font-size: 13px;
              font-weight: bold;
            `}
          >
            {subtitle}
          </Typography>
        </div>
        {info && (
          <Typography
            css={css`
              align-self: flex-start;
              margin: 0;
              margin-left: auto;
              color: #0774d3;
              font-size: 11px;
              font-weight: bold;
            `}
          >
            {info}
          </Typography>
        )}
      </header>

      {children}
    </div>
  );
};

export default DashboardCard;
