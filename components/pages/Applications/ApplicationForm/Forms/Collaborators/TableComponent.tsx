/*
 * Copyright (c) 2021 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

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
