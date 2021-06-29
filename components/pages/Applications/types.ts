import { Method } from 'axios';
import { SortingRule } from 'react-table';
import { string } from 'yup/lib/locale';

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
};

interface Address {
  building: string;
  cityAndProvince: string;
  country: string;
  postalCode: string;
  streetAddress: string;
}

interface IndividualInfo {
  firstName: string;
  googleEmail: string;
  displayName: string;
  institutionEmail: string;
  institutionWebsite: string;
  lastName: string;
  middleName: string;
  positionTitle: string;
  primaryAffiliation: string;
  suffix: string;
  title: string;
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

export enum ITAgreementEnum {
  IT_AGREEMENT_CONTACT_DACO_FRAUD = 'it_agreement_contact_daco_fraud',
  IT_AGREEMENT_PROVIDE_INSTITUTIONAL_POLICIES = 'it_agreement_provide_institutional_policies',
  IT_AGREEMENT_ONBOARD_TRAINING = 'it_agreement_onboard_training',
  IT_AGREEMENT_DESTROY_COPIES = 'it_agreement_destroy_copies',
  IT_AGREEMENT_MONITOR_ACCESS = 'it_agreement_monitor_access',
  IT_AGREEMENT_PROTECT_DATA = 'it_agreement_protect_data',
  IT_AGREEMENT_SOFTWARE_UPDATES = 'it_agreement_software_updates',
}

export enum DataAccessAgreementEnum {
  DAA_CORRECT_APPLICATION_CONTENT = 'daa_correct_application_content',
  DAA_AGREE_TO_TERMS = 'daa_agree_to_terms',
}

interface ITAgreement extends Agreement {
  name: ITAgreementEnum;
}

export interface DataAccessAgreement extends Agreement {
  name: DataAccessAgreementEnum;
}

export interface ITAgreements {
  agreements: ITAgreement[];
}

export enum CollaboratorType {
  STUDENT = 'student',
  PERSONNEL = 'personnel',
}

interface Collaborator {
  info: IndividualInfo;
  type: CollaboratorType;
  id: string;
}

interface Representative {
  address: Address;
  info: IndividualInfo;
}

interface Collaborators {
  list: Collaborator[];
}

interface ProjectInfo {
  publicationsURLs: string[];
  background: string;
  methodology: string;
  aims: string;
  website: string;
  title: string;
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
    ITAgreements: ITAgreements;
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
