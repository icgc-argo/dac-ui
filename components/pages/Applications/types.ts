import { Method } from 'axios';
import { SortingRule } from 'react-table';
import { ApplicationState } from 'components/ApplicationProgressBar/types';

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
  appId?: string;
  data?: any;
  method?: Method;
  page?: number;
  pageSize?: number;
  sort?: ApplicationsSort[];
  states?: ApplicationState[];
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
  lastUpdatedAtUtc: string;
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
  // TODO: nested properties currently can't sort. waiting for backend
  'applicant.info.displayName' = 'displayName',
  'applicant.info.googleEmail' = 'googleEmail',
  'applicant.info.primaryAffiliation' = 'primaryAffiliation',
  'ethics.declaredAsRequired' = 'ethicsRequired',
  appId = 'appId',
  expiresAtUtc = 'expiresAtUtc',
  lastUpdatedAtUtc = 'lastUpdatedAtUtc',
  state = 'state',
}
