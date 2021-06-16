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

export type SortedChangeFunction = (
  newSorted: SortingRule[],
  column: any,
  additive: boolean,
) => void;

export type ApplicationsRequestData = {
  page?: number;
  pageSize?: number;
  sort?: string;
};

export type ApplicationsSort = {
  field: ApplicationsField;
  order: ApplicationsSortOrder;
};

export type ApplicationsSortOrder = 'asc' | 'desc';

export type ApplicationsSortingRule = SortingRule & {
  id: ApplicationsField | string;
};

export type ApplicationsResponseItem = {
  appId: string;
  applicant: {
    info: {
      primaryAffiliation: string;
      displayName: string;
      googleEmail: string;
    };
  };
  ethics: {
    declaredAsRequired: string;
  };
  expiresAtUtc: string;
  updatedAtUtc: string;
  state: string;
};

export type ApplicationsResponseData = {
  pagingInfo: {
    totalCount: number;
    pagesCount: number;
    index: number;
  };
  items: ApplicationsResponseItem[];
};

export enum ApplicationsField {
  'applicant.info.displayName' = 'applicant.info.displayName',
  'applicant.info.googleEmail' = 'applicant.info.googleEmail',
  'applicant.info.primaryAffiliation' = 'applicant.info.primaryAffiliation',
  'ethics.declaredAsRequired' = 'ethics.declaredAsRequired',
  appId = 'appId',
  expiresAtUtc = 'expiresAtUtc',
  state = 'state',
  updatedAtUtc = 'updatedAtUtc',
}
