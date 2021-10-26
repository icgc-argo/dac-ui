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

import { startCase } from 'lodash';
import { format as formatDate } from 'date-fns';
import urlJoin from 'url-join';
import Link from '@icgc-argo/uikit/Link';
import { TableColumnConfig } from '@icgc-argo/uikit/Table';
import { DATE_RANGE_DISPLAY_FORMAT } from 'global/constants';
import { APPLICATIONS_PATH } from 'global/constants/internalPaths';
import {
  ApplicationRecord,
  ApplicationsField,
  ApplicationsResponseItem,
  ApplicationsSort,
} from '../types';

import { ApplicationState } from 'components/ApplicationProgressBar/types';
import { css } from '@icgc-argo/uikit';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import router from 'next/router';

export const stringifySort = (sortArr: ApplicationsSort[]) =>
  sortArr.map(({ field, order }) => `${field}:${order}`).join(', ');

export const stringifyStates = (statesArr: ApplicationState[]) => statesArr.join(',');

export const fieldDisplayNames = {
  appId: 'Application #',
  'applicant.info.primaryAffiliation': 'Institution',
  'applicant.address.country': 'Country',
  'applicant.info.displayName': 'Applicant',
  'applicant.info.googleEmail': 'Applicant Google Email',
  expiresAtUtc: 'Access Expiry',
  lastUpdatedAtUtc: 'Last Updated',
  state: 'Status',
  'ethics.declaredAsRequired': 'Ethics Letter',
  currentApprovedAppDoc: 'Approved PDF',
};

export const formatTableData = (data: ApplicationsResponseItem[]) =>
  data.map<ApplicationRecord>((datum: ApplicationsResponseItem) => ({
    appId: datum.appId,
    institution: datum.applicant.info.primaryAffiliation,
    country: datum.applicant.address.country,
    applicant: datum.applicant.info.displayName,
    googleEmail: datum.applicant.info.googleEmail,
    ethicsLetter: datum.ethics.declaredAsRequired,
    currentApprovedAppDoc: datum.currentApprovedAppDoc,
    accessExpiry: datum.closedAtUtc || datum.expiresAtUtc,
    lastUpdated: datum.lastUpdatedAtUtc,
    status: datum.state,
  }));

export const tableColumns: TableColumnConfig<ApplicationRecord> & {
  id: ApplicationsField;
} = [
  {
    Header: fieldDisplayNames.appId,
    id: ApplicationsField.appId,
    accessor: 'appId',
    Cell: ({ original }: { original: ApplicationRecord }) =>
      original.appId ? (
        <Link onClick={() => router.push(urlJoin(APPLICATIONS_PATH, original.appId))}>
          {original.appId}
        </Link>
      ) : null,
  },
  {
    Header: fieldDisplayNames['applicant.info.primaryAffiliation'],
    id: ApplicationsField['applicant.info.primaryAffiliation'],
    accessor: 'institution',
  },
  {
    Header: fieldDisplayNames['applicant.address.country'],
    id: ApplicationsField['applicant.address.country'],
    accessor: 'country',
  },
  {
    Header: fieldDisplayNames['applicant.info.displayName'],
    id: ApplicationsField['applicant.info.displayName'],
    accessor: 'applicant',
  },
  {
    Header: fieldDisplayNames['applicant.info.googleEmail'],
    id: ApplicationsField['applicant.info.googleEmail'],
    accessor: 'googleEmail',
  },
  {
    Header: fieldDisplayNames['ethics.declaredAsRequired'],
    id: ApplicationsField['ethics.declaredAsRequired'],
    Cell: ({ original }: { original: ApplicationRecord }) => (original.ethicsLetter ? 'Yes' : 'No'),
  },
  {
    Header: fieldDisplayNames['currentApprovedAppDoc'],
    id: ApplicationsField['currentApprovedAppDoc'],
    Cell: ({ original }: { original: ApplicationRecord }) =>
      original.currentApprovedAppDoc ? 'Yes' : null,
  },
  {
    Header: fieldDisplayNames.expiresAtUtc,
    id: ApplicationsField.expiresAtUtc,
    accessor: 'accessExpiry',
    Cell: ({ original }: { original: ApplicationRecord }) => {
      const theme = useTheme();
      return (
        <div
          css={css`
            color: ${theme.colors[
              original.status === ApplicationState.CLOSED ? 'error' : 'secondary'
            ]}; ;
          `}
        >
          {original.accessExpiry
            ? formatDate(new Date(original.accessExpiry), DATE_RANGE_DISPLAY_FORMAT)
            : null}
        </div>
      );
    },
  },
  {
    Header: fieldDisplayNames.lastUpdatedAtUtc,
    id: ApplicationsField.lastUpdatedAtUtc,
    accessor: 'lastUpdated',
    Cell: ({ original }: { original: ApplicationRecord }) =>
      original.lastUpdated
        ? formatDate(new Date(original.lastUpdated), DATE_RANGE_DISPLAY_FORMAT)
        : null,
  },
  {
    Header: fieldDisplayNames.state,
    id: ApplicationsField.state,
    accessor: 'status',
    Cell: ({ original }: { original: ApplicationRecord }) =>
      startCase(original.status.toLowerCase()),
  },
];

export const DEFAULT_PAGE: number = 0;
export const DEFAULT_PAGE_SIZE: number = 50;
export const DEFAULT_SORT: ApplicationsSort[] = [
  { field: 'state', order: 'desc' } as ApplicationsSort,
];

export const adminStatesAllowList = [
  'APPROVED',
  'CLOSED',
  'EXPIRED',
  'REJECTED',
  'RENEWING',
  'REVIEW',
  'REVISIONS REQUESTED',
] as ApplicationState[];
