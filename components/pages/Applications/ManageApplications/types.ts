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

export type CellProps = { original: Application };

export type Accessors =
  | 'appId'
  | 'institution'
  | 'applicant'
  | 'googleEmail'
  | 'ethicsLetter'
  | 'accessExpiry'
  | 'lastUpdated'
  | 'status';

export type ApplicationTable = {
  Header: string;
  accessor: Accessors;
  sortable?: boolean;
  Cell: ({ original }: { original: Application }) => string;
};
