export type Application = {
  appId: string;
  institution: string;
  applicant: string;
  googleEmail: string;
  ethicsLetter: string;
  accessExpiry: string;
  lastUpdated: string;
  status: string;
};

export type Accessors = keyof Application;

export type ManageApplicationsTable = {
  Header: string;
  accessor: Accessors;
  sortable?: boolean;
  Cell: ({ original }: { original: Application }) => string;
};

export type ManageApplicationsRequestData = {
  page: number;
  pageSize: number;
  sort: ManageApplicationsSort[];
};

export interface SortingRule {
  id: ManageApplicationsField;
  desc: boolean;
}

export type SortedChangeFunction = (
  newSorted: SortingRule[],
  column: any,
  additive: boolean,
) => void;

export enum ManageApplicationsField {
  appId = 'appId',
  displayName = 'displayName',
  expiresAtUtc = 'expiresAtUtc',
  googleEmail = 'googleEmail',
  primaryAffiliation = 'primaryAffiliation',
  state = 'state',
  updatedAtUtc = 'updatedAtUtc',
}

export type ManageApplicationsSortOrder = 'asc' | 'desc';

export type ManageApplicationsSortingRule = SortingRule & {
  id: ManageApplicationsField;
};

export type ManageApplicationsSort = {
  field: ManageApplicationsField;
  order: ManageApplicationsSortOrder;
};
