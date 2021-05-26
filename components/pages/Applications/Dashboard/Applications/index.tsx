import { css } from '@emotion/core';
import { UikitTheme } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import Link from '@icgc-argo/uikit/Link';
import { ContentBody, ContentBox } from '@icgc-argo/uikit/PageLayout';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';
import React from 'react';

const Applications = () => {
  const theme: UikitTheme = useTheme();

  return (
    <ContentBox
      css={css`
        box-sizing: border-box;
        margin: 10px auto 0;
        max-width: 1200px;
        min-width: 665px;
        width: 100%;
      `}
    >
      <header
        css={css`
          align-items: center;
          border-bottom: 1px solid ${theme.colors.grey_2};
          height: 40px;
          display: flex;
          padding: 0 40px;
          width: 100%;
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
          Start a New Application{' '}
        </Typography>
      </header>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 65px 0;
        `}
      >
        <div
          css={css`
            margin-bottom: 28px;
            max-width: 520px;
            text-align: center;
          `}
        >
          Start a new application, fill out all required sections, then sign and submit the
          application. The ICGC DACO will review and grant access to{' '}
          <Link>eligible project teams.</Link>
        </div>

        <Button onClick={function noRefCheck() {}} size="sm">
          <Icon
            css={css`
              margin-bottom: -2px;
            `}
            fill={theme.colors.white}
            height="12px"
            name="file"
          />
          Start a new application
        </Button>
      </div>
    </ContentBox>
  );
};

export default Applications;
