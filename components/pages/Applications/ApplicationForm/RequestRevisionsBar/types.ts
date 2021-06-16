export enum RequestRevisionsFieldTitles {
  applicant = 'A. Applicant Information',
  representative = 'B. Institutional Representative',
  collaborators = 'C. Collaborators',
  projectInfo = 'D. Project Information',
  ethicsLetter = 'E. Ethics',
  signature = 'Sign & Submit',
  general = 'Include general comments in email',
}

export type RequestRevisionsFieldNames = keyof typeof RequestRevisionsFieldTitles;

export type RequestRevisionProperties = {
  details: string;
  requested: boolean;
};

export type RequestRevisionsFieldsState = {
  [key in RequestRevisionsFieldNames]: RequestRevisionProperties;
};

export type RequestRevisionsState = {
  isSecondaryFieldsEnabled: boolean;
  isSendEnabled: boolean;
  fields: RequestRevisionsFieldsState;
};
