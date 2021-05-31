import { css } from '@emotion/core';
import { UikitTheme } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import Link from '@icgc-argo/uikit/Link';
import { ContentBody, ContentBox } from '@icgc-argo/uikit/PageLayout';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import React from 'react';
import StartApplication from './Start';

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
      <StartApplication />
    </ContentBox>
  );
};

export default Applications;
