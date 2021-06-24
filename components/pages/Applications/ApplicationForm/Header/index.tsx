import { ReactElement, useState } from 'react';
import { css } from '@icgc-argo/uikit';

import PageHeader from 'components/PageHeader';
import Actions from './Actions';
import Details from './Details';
import Progress from './Progress';

const ApplicationHeader = ({ appId = 'none' }): ReactElement => {
  const [applicationDetails, setApplicationDetails] = useState({
    createdAt: 'May. 22, 2021',
    lastUpdated: 'May. 24, 2021  1:57 p.m.',
  });

  return (
    <PageHeader>
      <div
        css={css`
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin: 0 auto;
          max-width: 1200px;
          width: 100%;
        `}
      >
        <Details appId={appId} {...applicationDetails} />

        <Progress />

        <Actions appId={appId} />
      </div>
    </PageHeader>
  );
};

export default ApplicationHeader;
