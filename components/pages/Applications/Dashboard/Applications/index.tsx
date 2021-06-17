import React from 'react';
import InProgress from './InProgress';
import StartApplication from './Start';
import { css } from '@emotion/core';
import useApplicationsAPI from 'global/hooks/useApplicationsAPI';

const Applications = () => {
  const { error, isLoading, response } = useApplicationsAPI({});

  const inProgressApplications: any = response?.data?.items || [];
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
          grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
        `}
      >
        {inProgressApplications.map((application) => (
          <InProgress application={application} />
        ))}
        <StartApplication />
      </div>
    </div>
  );
};

export default Applications;
