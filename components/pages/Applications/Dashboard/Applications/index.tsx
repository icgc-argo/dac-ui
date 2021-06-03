import { ContentBody } from '@icgc-argo/uikit/PageLayout';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { styled, UikitTheme } from '@icgc-argo/uikit/index';
import React from 'react';
import InProgress from './InProgress';
import StartApplication from './Start';

type ApplicationsProps = {
  inProgressApplications: any;
};

const TwoColGrid = styled('div')`
  display: grid;
  grid-gap: 24px;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
`;

const Applications = ({ inProgressApplications = true }: ApplicationsProps) => {
  const theme: UikitTheme = useTheme();

  return (
    <ContentBody>
      <TwoColGrid>
        <InProgress />
        <StartApplication />
      </TwoColGrid>
    </ContentBody>
  );
};

export default Applications;
