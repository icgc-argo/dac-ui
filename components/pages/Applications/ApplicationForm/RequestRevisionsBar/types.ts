export enum RequestRevisionsSectionTitles {
  applicant = 'A. Applicant Information',
  representative = 'B. Institutional Representative',
  collaborators = 'C. Collaborators',
  projectInfo = 'D. Project Information',
  ethicsLetter = 'E. Ethics',
  signature = 'Sign & Submit',
  general = 'Include general comments in email',
}

export type RequestRevisionsSectionKeys = keyof typeof RequestRevisionsSectionTitles;

export type RequestRevisionProperties = {
  details: string;
  requested: boolean;
};

export type RequestRevisionsSectionState = {
  [key in RequestRevisionsSectionKeys]: RequestRevisionProperties;
};
