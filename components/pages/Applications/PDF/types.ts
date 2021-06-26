import { string } from 'yup/lib/locale';

export enum FieldAccessor {
  DISPLAY_NAME = 'displayName',
  PRIMARY_AFFILIATION = 'primaryAffiliation',
  INSTITUTIONAL_EMAIL = 'institutionEmail',
  GOOGLE_EMAIL = 'googleEmail',
  RESEARCHER_PROFILE_URL = 'institutionWebsite',
  POSITION_TITLE = 'positionTitle',
}

export enum PdfFieldName {
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

export type PdfFormField = {
  [key in PdfFieldName]: { fieldName: string; fieldKey: FieldAccessor };
};
