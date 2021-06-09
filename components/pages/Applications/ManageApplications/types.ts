import { SortingRule } from 'react-table';

export type ApplicationRecord = {
  appId: string;
  institution: string;
  applicant: string;
  googleEmail: string;
  ethicsLetter: string;
  accessExpiry: string;
  lastUpdated: string;
  status: string;
};

export type Accessors = keyof ApplicationRecord;

export type SortedChangeFunction = (
  newSorted: SortingRule[],
  column: any,
  additive: boolean,
) => void;

export type ManageApplicationsRequestData = {
  page: number;
  pageSize: number;
  sort: ManageApplicationsSort[];
};

export type ManageApplicationsSort = {
  field: ManageApplicationsField;
  order: ManageApplicationsSortOrder;
};

export type ManageApplicationsSortOrder = 'asc' | 'desc';

export type ManageApplicationsSortingRule = SortingRule & {
  id: ManageApplicationsField | string;
};

export type ManageApplicationsResponseItem = {};

export type ManageApplicationsResponseData = {
  pagingInfo: {
    totalCount: number;
    pagesCount: number;
    index: number;
  };
  items: ManageApplicationsResponseItem[];
};

export enum ManageApplicationsField {
  'applicant.info.displayName' = 'applicant.info.displayName',
  'applicant.info.googleEmail' = 'applicant.info.googleEmail',
  'applicant.info.primaryAffiliation' = 'applicant.info.primaryAffiliation',
  'ethics.declaredAsRequired' = 'ethics.declaredAsRequired',
  appId = 'appId',
  expiresAtUtc = 'expiresAtUtc',
  state = 'state',
  updatedAtUtc = 'updatedAtUtc',
}
