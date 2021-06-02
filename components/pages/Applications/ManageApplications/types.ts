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
