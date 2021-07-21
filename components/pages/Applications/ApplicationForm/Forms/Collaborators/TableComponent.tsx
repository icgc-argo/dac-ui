import { RefObject } from 'react';
import Table from '@icgc-argo/uikit/Table';
import { css } from '@emotion/core';

import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

import { ApplicationState, CollaboratorType } from 'components/pages/Applications/types';

const Actions = ({
  editCollaborator,
  removeCollaborator,
  status,
}: {
  editCollaborator: () => void;
  removeCollaborator: () => void;
  status: ApplicationState;
}) => {
  const theme = useTheme();

  return (
    <div
      css={css`
        width: 100%;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;

        svg:hover {
          cursor: pointer;
        }
      `}
    >
      {!['APPROVED'].includes(status) && (
        <Icon
          name="edit"
          width="20px"
          height="20px"
          fill={theme.colors.accent2}
          onClick={editCollaborator}
        />
      )}
      <Icon name="trash" width="19px" height="20px" onClick={removeCollaborator} />
    </div>
  );
};

const TableComponent = ({
  containerRef,
  data = [],
  handleActions,
  status,
}: {
  containerRef: RefObject<HTMLDivElement>;
  data: [];
  handleActions: (action: 'edit' | 'remove', collaboratorId: string) => () => void;
  status: ApplicationState;
}) => (
  <Table
    css={css`
      margin-top: 9px;
    `}
    showPagination={false}
    defaultSorted={[{ id: 'positionTitle', desc: false }]}
    columns={[
      {
        accessor: 'type',
        Cell: ({ value }: { value: CollaboratorType }) =>
          `Authorized ${value.charAt(0).toUpperCase()}${value.slice(1)}`,
        Header: 'Collaborator Type',
        id: 'positionTitle',
        width: 150,
      },
      {
        accessor: 'info.firstName',
        Header: 'First Name',
      },
      {
        accessor: 'info.lastName',
        Header: 'Last Name',
      },
      {
        accessor: 'info.institutionEmail',
        Header: 'Institutional Email',
        width: 170,
      },
      {
        accessor: 'info.googleEmail',
        Header: 'Google Email',
        width: 170,
      },
      {
        accessor: 'id',
        Cell: ({ value }: { value: string }) => {
          return (
            <Actions
              editCollaborator={handleActions('edit', value)}
              removeCollaborator={handleActions('remove', value)}
              status={status}
            />
          );
        },
        Header: 'Actions',
        width: 90,
      },
    ]}
    data={data}
    parentRef={containerRef}
    stripped
    withOutsideBorder
  />
);

export default TableComponent;
