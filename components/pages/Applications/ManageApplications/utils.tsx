import { startCase } from 'lodash';
import { format as formatDate } from 'date-fns';
import urlJoin from 'url-join';
import Link from '@icgc-argo/uikit/Link';
import { TableColumnConfig } from '@icgc-argo/uikit/Table';
import { DATE_RANGE_DISPLAY_FORMAT } from 'global/constants';
import { APPLICATIONS_PATH } from 'global/constants/internalPaths';
import {
  ApplicationRecord,
  ManageApplicationsField,
  ManageApplicationsResponseItem,
  ManageApplicationsSort,
} from './types';

export const stringifySort = (sortArr: ManageApplicationsSort[]) =>
  sortArr.map(({ field, order }) => `${field}:${order}`).join(',');

export const fieldDisplayNames = {
  appId: 'Application #',
  'applicant.info.primaryAffiliation': 'Institution',
  'applicant.info.displayName': 'Applicant',
  'applicant.info.googleEmail': 'Applicant Google Email',
  expiresAtUtc: 'Access Expiry',
  updatedAtUtc: 'Last Updated',
  state: 'Status',
  'ethics.declaredAsRequired': 'Ethics Letter',
};

// TODO cleanup any type
export const formatTableData = (data: ManageApplicationsResponseItem[]) =>
  data.map<ApplicationRecord>((datum: ManageApplicationsResponseItem) => ({
    appId: datum.appId,
    institution: datum.applicant.info.primaryAffiliation,
    applicant: datum.applicant.info.displayName,
    googleEmail: datum.applicant.info.googleEmail,
    ethicsLetter: datum.ethics.declaredAsRequired,
    accessExpiry: datum.expiresAtUtc,
    lastUpdated: datum.updatedAtUtc,
    status: datum.state,
  }));

export const tableColumns: TableColumnConfig<ApplicationRecord> & {
  id: ManageApplicationsField;
} = [
    {
      Header: fieldDisplayNames['appId'],
      id: ManageApplicationsField['appId'],
      accessor: 'appId',
      Cell: ({ original }: { original: ApplicationRecord }) => original.appId
        ? (
          <Link href={urlJoin(APPLICATIONS_PATH, original.appId)}>{original.appId}</Link>
        )
        : null,
    },
    {
      Header: fieldDisplayNames['applicant.info.primaryAffiliation'],
      id: ManageApplicationsField['applicant.info.primaryAffiliation'],
      accessor: 'institution',
    },
    {
      Header: fieldDisplayNames['applicant.info.displayName'],
      id: ManageApplicationsField['applicant.info.displayName'],
      accessor: 'applicant',
    },
    {
      Header: fieldDisplayNames['applicant.info.googleEmail'],
      id: ManageApplicationsField['applicant.info.googleEmail'],
      accessor: 'googleEmail',
    },
    {
      Header: fieldDisplayNames['ethics.declaredAsRequired'],
      id: ManageApplicationsField['ethics.declaredAsRequired'],
      sortable: false,
      Cell: ({ original }: { original: ApplicationRecord }) => (original.ethicsLetter ? 'Yes' : 'No'),
    },
    {
      Header: fieldDisplayNames['expiresAtUtc'],
      id: ManageApplicationsField['expiresAtUtc'],
      accessor: 'accessExpiry',
      Cell: ({ original }: { original: ApplicationRecord }) =>
        original.accessExpiry
          ? formatDate(new Date(original.accessExpiry), DATE_RANGE_DISPLAY_FORMAT)
          : null,
    },
    {
      Header: fieldDisplayNames['updatedAtUtc'],
      id: ManageApplicationsField['updatedAtUtc'],
      accessor: 'lastUpdated',
      Cell: ({ original }: { original: ApplicationRecord }) =>
        original.lastUpdated
          ? formatDate(new Date(original.lastUpdated), DATE_RANGE_DISPLAY_FORMAT)
          : null,
    },
    {
      Header: fieldDisplayNames['state'],
      id: ManageApplicationsField['state'],
      accessor: 'status',
      Cell: ({ original }: { original: ApplicationRecord }) =>
        startCase(original.status.toLowerCase()),
    },
  ];

export const DEFAULT_PAGE: number = 0;
export const DEFAULT_PAGE_SIZE: number = 20;
export const DEFAULT_SORT: ManageApplicationsSort[] = [
  { field: 'state', order: 'desc' } as ManageApplicationsSort,
];
