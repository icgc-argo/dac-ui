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

export const stringifySort = (sortArr: ApplicationsSort[]) =>
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

export const formatTableData = (data: ApplicationsResponseItem[]) =>
  data
    .filter((datum: ApplicationsResponseItem) => !['DRAFT'].includes(datum.state))
    .map<ApplicationRecord>((datum: ApplicationsResponseItem) => ({
      appId: datum.appId,
      institution: datum.applicant.info.primaryAffiliation,
      applicant: datum.applicant.info.displayName,
      googleEmail: datum.applicant.info.googleEmail,
      ethicsLetter: datum.ethics.declaredAsRequired,
      accessExpiry: datum.expiresAtUtc,
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
      Cell: ({ original }: { original: ApplicationRecord }) => original.appId
        ? (
          <Link href={urlJoin(APPLICATIONS_PATH, original.appId)}>{original.appId}</Link>
        )
        : null,
    },
    {
      Header: fieldDisplayNames['applicant.info.primaryAffiliation'],
      id: ApplicationsField['applicant.info.primaryAffiliation'],
      accessor: 'institution',
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
      Header: fieldDisplayNames.expiresAtUtc,
      id: ApplicationsField.expiresAtUtc,
      accessor: 'accessExpiry',
      Cell: ({ original }: { original: ApplicationRecord }) =>
        original.accessExpiry
          ? formatDate(new Date(original.accessExpiry), DATE_RANGE_DISPLAY_FORMAT)
          : null,
    },
    {
      Header: fieldDisplayNames.updatedAtUtc,
      id: ApplicationsField.updatedAtUtc,
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
export const DEFAULT_PAGE_SIZE: number = 20;
export const DEFAULT_SORT: ApplicationsSort[] = [
  { field: 'state', order: 'desc' } as ApplicationsSort,
];
