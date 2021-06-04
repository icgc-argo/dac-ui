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

export type ApplicationTable = {
  Header: string;
  accessor: Accessors;
  sortable?: boolean;
  Cell: ({ original }: { original: Application }) => string;
};

export type ApplicationsTableSort =
  | 'appId:asc'
  | 'appId:desc'
  | 'displayName:asc'
  | 'displayName:desc'
  | 'expiresAtUtc:asc'
  | 'expiresAtUtc:desc'
  | 'googleEmail:asc'
  | 'googleEmail:desc'
  | 'primaryAffiliation:asc'
  | 'primaryAffiliation:desc'
  | 'state:asc'
  | 'state:desc'
  | 'updatedAtUtc:asc'
  | 'updatedAtUtc:desc';

export type ApplicationsRequestData = {
  page: number;
  pageSize: number;
  sort: ApplicationsTableSort;
};
