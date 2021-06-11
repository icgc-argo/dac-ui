import { ContentBody } from '@icgc-argo/uikit/PageLayout';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { styled, UikitTheme } from '@icgc-argo/uikit/index';
import React from 'react';
import InProgress from './InProgress';
import StartApplication from './Start';
import { css } from '@emotion/core';

type ApplicationsProps = {
  inProgressApplication: any;
};

const Applications = ({ inProgressApplication = null }: ApplicationsProps) => {
  const theme: UikitTheme = useTheme();

  return (
    <div
      css={css`
        flex: 1 0 auto;
      `}
    >
      <div
        css={css`
          display: grid;
          grid-gap: 24px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        `}
      >
        <InProgress />
        <StartApplication />
      </div>
    </div>
  );
};

export default Applications;
