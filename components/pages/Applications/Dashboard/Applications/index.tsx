import { useEffect, useState } from 'react';
import InProgress from './InProgress';
import StartApplication from './Start';
import { css } from '@emotion/core';
import { ApplicationsResponseItem } from 'components/pages/Applications/types';
import { isEmpty } from 'lodash';

const Applications = ({ inProgressApplications }: { inProgressApplications: ApplicationsResponseItem[] }) => {

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
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          margin-bottom: 24px;
        `}
      >
        {!isEmpty(inProgressApplications) &&
          inProgressApplications.map((application: ApplicationsResponseItem) => (
            <InProgress application={application} key={application.appId} />
          ))}
        <StartApplication />
      </div>
    </div>
  );
};

export default Applications;
