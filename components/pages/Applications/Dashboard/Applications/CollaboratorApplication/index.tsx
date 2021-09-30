import { css } from '@emotion/core';
import Table from '@icgc-argo/uikit/Table';
import { createRef } from 'react';
import DashboardCard from '../../Card';

const CollaboratorApplication = () => {
  const containerRef = createRef<HTMLDivElement>();
  return (
    <DashboardCard
      title="Collaborator Applications"
      subtitle="You have data access from the following applications"
      CustomIcon={() => (
        <img
          src="/icons-collaborator.svg"
          css={css`
            margin-right: 8px;
          `}
          width="30px"
          height="30px"
        />
      )}
    >
      <Table
        data={[
          {
            appId: 'DACO-1234',
            expiresAtUtc: '2012-04-23T18:25:43.511Z',
            institution: 'OICR',
            applicant: 'bob',
          },
        ]}
        columns={[
          {
            accessor: 'appId',
            Header: 'Application #',
          },
          {
            accessor: 'institution',
            Header: 'Institution',
          },
          { accessor: 'applicant', Header: 'Applicant' },
          { accessor: 'expiresAtUtc', Header: 'Access Expiry' },
        ]}
        parentRef={containerRef}
        showPagination={false}
        withOutsideBorder
        stripped
      />
    </DashboardCard>
  );
};

export default CollaboratorApplication;
