import { string } from 'yup/lib/locale';

export enum FieldAccessor {
  DISPLAY_NAME = 'displayName',
  PRIMARY_AFFILIATION = 'primaryAffiliation',
  INSTITUTIONAL_EMAIL = 'institutionEmail',
  GOOGLE_EMAIL = 'googleEmail',
  RESEARCHER_PROFILE_URL = 'institutionWebsite',
  POSITION_TITLE = 'positionTitle',
  PROJECT_TITLE = 'title',
  PROJECT_WEBSITE = 'website',
}

export enum PdfField {
  NAME = 'NAME',
  PRIMARY_AFFILIATION = 'PRIMARY_AFFILIATION',
  INSTITUTIONAL_EMAIL = 'INSTITUTIONAL_EMAIL',
  GOOGLE_EMAIL = 'GOOGLE_EMAIL',
  RESEARCHER_PROFILE_URL = 'RESEARCHER_PROFILE_URL',
  POSITION_TITLE = 'POSITION_TITLE',
  PURSUING_DEGREE = 'PURSUING_DEGREE',
  PROJECT_TITLE = 'PROJECT_TITLE',
  PROJECT_WEBSITE = 'PROJECT_WEBSITE',
  PUBLICATION_URL = 'PUBLICATION_URL',
}

export enum PdfFieldName {
  NAME = 'Name',
  PRIMARY_AFFILIATION = 'Primary Affiliation',
  INSTITUTIONAL_EMAIL = 'Institutional Email',
  GOOGLE_EMAIL = 'Google Email',
  RESEARCHER_PROFILE_URL = 'Researcher Profile URL',
  POSITION_TITLE = 'Position Title',
  PURSUING_DEGREE = 'Pursuing Degree',
  PROJECT_TITLE = 'Project Title',
  PROJECT_WEBSITE = 'Project Website',
  PUBLICATION_URL = 'Publication URL',
}

export type PdfFormField = {
  [key in PdfField]: { fieldName: PdfFieldName; fieldKey: FieldAccessor };
};
