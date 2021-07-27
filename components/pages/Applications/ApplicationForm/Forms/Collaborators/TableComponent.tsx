import { RefObject } from 'react';
import { RowInfo } from 'react-table';
import { css } from '@emotion/core';

import { UikitTheme } from '@icgc-argo/uikit/index';
import Icon from '@icgc-argo/uikit/Icon';
import Table from '@icgc-argo/uikit/Table';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

import { ApplicationState, CollaboratorType } from 'components/pages/Applications/types';

const Actions = ({
  editCollaborator,
  removeCollaborator,
  applicationState,
  disabled,
}: {
  editCollaborator: () => void;
  removeCollaborator: () => void;
  applicationState: ApplicationState;
  disabled: boolean;
}) => {
  const theme: UikitTheme = useTheme();

  const iconColor = theme.colors[disabled ? 'grey_disabled' : 'accent2'];

  return (
    <div
      css={css`
        width: 100%;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;

        svg:hover {
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
        }
      `}
    >
      {!['APPROVED'].includes(applicationState) && (
        <Icon
          name="edit"
          width="20px"
          height="20px"
          fill={iconColor}
          onClick={() => (disabled ? null : editCollaborator())}
        />
      )}
      <Icon
        name="trash"
        width="19px"
        height="20px"
        fill={iconColor}
        onClick={() => (disabled ? null : removeCollaborator())}
      />
    </div>
  );
};

const TableComponent = ({
  containerRef,
  data = [],
  handleActions,
  applicationState,
  disableActions,
}: {
  containerRef: RefObject<HTMLDivElement>;
  data: [];
  handleActions: (action: 'edit' | 'remove', collaboratorId: string) => () => void;
  applicationState: ApplicationState;
  disableActions: boolean;
}) => {
  const theme: UikitTheme = useTheme();
  return (
    <Table
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
                disabled={disableActions}
                editCollaborator={handleActions('edit', value)}
                removeCollaborator={handleActions('remove', value)}
                applicationState={applicationState}
              />
            );
          },
          Header: 'Actions',
          width: 90,
        },
      ]}
      css={css`
        margin-top: 9px;
      `}
      data={data}
      defaultSorted={[{ id: 'positionTitle', desc: false }]}
      getTrProps={(state: any, rowInfo?: RowInfo) => ({
        ...(rowInfo?.original?.meta?.errorsList?.length > 0 && {
          style: {
            background: theme.colors.error_4,
          },
        }),
      })}
      parentRef={containerRef}
      showPagination={false}
      stripped
      withOutsideBorder
    />
  );
};

export default TableComponent;
