import { AxiosResponse, Method } from 'axios';
import { SortingRule } from 'react-table';
import { FieldAccessor } from './PDF/types';

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

export enum ApplicationState {
  DRAFT = 'DRAFT',
  SIGN_AND_SUBMIT = 'SIGN AND SUBMIT',
  REVIEW = 'REVIEW',
  REVISIONS_REQUESTED = 'REVISIONS REQUESTED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  RENEWING = 'RENEWING',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

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

export interface Agreement {
  name: string;
  accepted: boolean;
}

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
  createdAtUtc: string;
  submittedAtUtc: string;
  closedAtUtc: string;
  approvedAtUtc: string;
};

export type ApplicationDataByField = {
  [k in FieldAccessor]: string | string[];
};

export type IndividualInfo = {
  [FieldAccessor.FIRST_NAME]: string;
  [FieldAccessor.GOOGLE_EMAIL]: string;
  [FieldAccessor.DISPLAY_NAME]: string;
  [FieldAccessor.INSTITUTIONAL_EMAIL]: string;
  [FieldAccessor.LAST_NAME]: string;
  [FieldAccessor.MIDDLE_NAME]: string;
  [FieldAccessor.POSITION_TITLE]: string;
  [FieldAccessor.PRIMARY_AFFILIATION]: string;
  [FieldAccessor.SUFFIX]: string;
  [FieldAccessor.TITLE]: string;
};

interface Address {
  building: string;
  cityAndProvince: string;
  country: string;
  postalCode: string;
  streetAddress: string;
}

interface Terms {
  agreement: Agreement;
}

interface Individual {
  address: Address;
  info: IndividualInfo;
}

export interface ApprovalDoc {
  name: 'string';
  objectId: 'string';
  uploadedAtUtc: 'string';
}

export interface ProjectInfo {
  [FieldAccessor.PUBLICATIONS_URL]: string[];
  [FieldAccessor.BACKGROUND]: string;
  [FieldAccessor.METHODOLOGY]: string;
  [FieldAccessor.AIMS]: string;
  [FieldAccessor.WEBSITE]: string;
  [FieldAccessor.TITLE]: string;
  [FieldAccessor.SUMMARY]: string;
}

export enum DataAccessAgreementEnum {
  IT_AGREEMENT_CONTACT_DACO_FRAUD = 'it_agreement_contact_daco_fraud',
  IT_AGREEMENT_PROVIDE_INSTITUTIONAL_POLICIES = 'it_agreement_provide_institutional_policies',
  IT_AGREEMENT_ONBOARD_TRAINING = 'it_agreement_onboard_training',
  IT_AGREEMENT_DESTROY_COPIES = 'it_agreement_destroy_copies',
  IT_AGREEMENT_MONITOR_ACCESS = 'it_agreement_monitor_access',
  IT_AGREEMENT_PROTECT_DATA = 'it_agreement_protect_data',
  IT_AGREEMENT_SOFTWARE_UPDATES = 'it_agreement_software_updates',
  DAA_CORRECT_APPLICATION_CONTENT = 'daa_correct_application_content',
  DAA_AGREE_TO_TERMS = 'daa_agree_to_terms',
}

export interface DataAccessAgreement extends Agreement {
  name: DataAccessAgreementEnum;
}

export enum CollaboratorType {
  PERSONNEL = 'personnel',
  STUDENT = 'student',
}

export interface Collaborator {
  info: IndividualInfo;
  type: CollaboratorType;
  id: string;
}

interface Representative {
  address?: Address;
  info: IndividualInfo;
  addressSameAsApplicant: boolean;
}

interface Collaborators {
  list: Collaborator[];
}

interface EthicsLetter {
  declaredAsRequired: boolean;
  approvalLetterDocs: ApprovalDoc[];
}

export interface DataAccessAgreement {
  agreements: DataAccessAgreement[];
}

export enum AppendixEnum {
  ICGC_GOALS_POLICIES = 'appendix_icgc_goals_policies',
  LARGE_SCALE_DATA_SHARING = 'appendix_large_scale_data_sharing',
  PREPUBLICATION_POLICY = 'appendix_prepublication_policy',
  PUBLICATION_POLICY = 'appendix_publication_policy',
  NIH_GENOMIC_INVENTIONS = 'appendix_nih_genomic_inventions',
  OECD_GENETIC_INVENTIONS = 'appendix_oecd_genetic_inventions',
  CLOUD_SECURITY = 'appendix_cloud_security',
  GA4GH_FRAMEWORK = 'appendix_ga4gh_framework',
}

export interface AppendixAgreement extends Agreement {
  name: AppendixEnum;
}

interface Appendices {
  agreements: AppendixAgreement[];
}

export interface ApplicationData {
  appId: string;
  state: ApplicationState;
  sections: {
    terms: Terms;
    applicant: Individual;
    representative: Representative;
    collaborators: Collaborators;
    projectInfo: ProjectInfo;
    ethicsLetter: EthicsLetter;
    dataAccessAgreement: DataAccessAgreement;
    appendices: Appendices;
  };
}

export type ApplicationsResponseData = {
  pagingInfo: {
    totalCount: number;
    pagesCount: number;
    index: number;
  };
  items: ApplicationsResponseItem[];
};

export enum ApplicationsField {
  'applicant.info.displayName' = 'displayName',
  'applicant.info.googleEmail' = 'googleEmail',
  'applicant.info.primaryAffiliation' = 'primaryAffiliation',
  'ethics.declaredAsRequired' = 'ethicsRequired',
  appId = 'appId',
  expiresAtUtc = 'expiresAtUtc',
  lastUpdatedAtUtc = 'lastUpdatedAtUtc',
  state = 'state',
}

export type AuthAPIFetchFunction = (options?: {
  data?: any;
  method?: Method;
}) => Promise<AxiosResponse<any>>;

export type AppDataRefresh = { state: string; lastUpdatedAtUtc?: string };
export type SetAppDataRefresh = (arg: AppDataRefresh) => void;
