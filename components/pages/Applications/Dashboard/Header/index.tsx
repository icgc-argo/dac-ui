import { css } from '@emotion/core';
import { ContentBody } from '@icgc-argo/uikit/PageLayout';
import Typography from '@icgc-argo/uikit/Typography';
import PageHeader from 'components/PageHeader';
import React from 'react';
import AccessBox from './AccessBox';

const DashboardHeader = () => (
  <>
    <PageHeader>
      <div css={css``}>
        <Typography
          css={css`
            padding: 15px 0 13px 0;
            align-items: center;
            display: flex;

            font-size: 24px;
            margin: 0;
          `}
        >
          My Applications
        </Typography>
      </div>
    </PageHeader>

    <ContentBody>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 57px;
        `}
      >
        <Typography
          variant="paragraph2"
          css={css`
            margin-right: 80px;
          `}
        >
          This is where you can manage your Applications for Access to ICGC Controlled Data. Access
          will be granted for a <b>one year period</b>, starting from the date of approval by the
          ICGC DACO.
        </Typography>
        <AccessBox hasAccess={true} />
      </div>
    </ContentBody>
  </>
);

export default DashboardHeader;
