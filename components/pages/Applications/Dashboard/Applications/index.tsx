import React from 'react';
import InProgress from './InProgress';
import StartApplication from './Start';
import { css } from '@emotion/core';
import { useGetApplications } from 'global/hooks';
import { isEmpty } from 'lodash';

const Applications = () => {
  const { error, isLoading, response } = useGetApplications({});
  const inProgressApplications: any = [true]; //response?.data;

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
        {!isEmpty(inProgressApplications) && <InProgress application={inProgressApplications[0]} />}
        <StartApplication />
      </div>
    </div>
  );
};

export default Applications;
