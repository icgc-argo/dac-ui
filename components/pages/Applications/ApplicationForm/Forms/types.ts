import { ChangeEvent, Dispatch, ReactNode } from 'react';
import {
  SchemaDescription,
  SchemaInnerTypeDescription,
  SchemaObjectDescription,
} from 'yup/lib/schema';
import { UikitIconNames } from '@icgc-argo/uikit/Icon/icons';
import { TAG_VARIANTS } from '@icgc-argo/uikit/Tag';

import { AuthAPIFetchFunction } from 'components/pages/Applications/types';

import { countriesList, honorificsList, sectionsOrder } from './constants';

export type CountryNamesAndAbbreviations = typeof countriesList[number];
export type FormSectionNames = typeof sectionsOrder[number];
export type HonorificsListTypes = typeof honorificsList[number];

export enum EVENT_TARGET_TAGS {
  INPUT = 'INPUT',
  MULTISELECT = 'MULTISELECT',
  REMOVE = 'REMOVE',
  SELECT = 'SELECT',
  TEXTAREA = 'TEXTAREA',
}

export enum SECTION_STATUS {
  AMMENDABLE = 'AMMENDABLE',
  COMPLETE = 'COMPLETE',
  DISABLED = 'DISABLED',
  INCOMPLETE = 'INCOMPLETE',
  LOCKED = 'LOCKED',
  PRISTINE = 'PRISTINE',
  REVISIONS_MADE = 'REVISIONS MADE',
  REVISIONS_REQUESTED = 'REVISIONS REQUESTED',
  REVISIONS_REQUESTED_DISABLED = 'REVISIONS REQUESTED DISABLED',
}

export enum FORM_STATES {
  CAN_EDIT = 'canEdit',
  COMPLETE = 'complete',
  DISABLED = 'disabled',
  INCOMPLETE = 'incomplete',
  LOCKED = 'locked',
  MUST_EDIT = 'mustEdit',
  TOUCHED = 'touched',
  PRISTINE = 'pristine',
}

export type SectionStatusMapping = Record<SECTION_STATUS, FormSectionOverallState>;

export type FormSectionOverallState = `${FORM_STATES}`;

export type ValidationConfigType = {
  iconName: UikitIconNames;
  tagVariant: keyof typeof TAG_VARIANTS;
};

export { TAG_VARIANTS };

export type FormFieldType = Partial<
  SchemaInnerTypeDescription &
    SchemaDescription & {
      error: string[];
      fields: any;
      touched: boolean;
      value: any;
    } & {
      // WIP: this handles shape mutations (validation vs persistence)
      meta: {
        shape: 'collection';
        type: 'boolean';
      };
    }
>;

type FormSectionValidationState_SectionsGenericType<T extends Record<string, FormFieldType>> =
  Record<string, Partial<T[keyof T] & FormFieldType>>;

export type FormSectionValidationState_Appendices = FormSectionValidationState_SectionsGenericType<{
  agreements: {
    fields: {
      appendix_icgc_goals_policies: FormFieldType;
      appendix_large_scale_data_sharing: FormFieldType;
      appendix_prepublication_policy: FormFieldType;
      appendix_publication_policy: FormFieldType;
      appendix_nih_genomic_inventions: FormFieldType;
      appendix_oecd_genetic_inventions: FormFieldType;
      appendix_cloud_security: FormFieldType;
      appendix_ga4gh_framework: FormFieldType;
    };
  };
}>;
export type FormSectionValidationState_Applicant = FormSectionValidationState_SectionsGenericType<{
  info_firstName: { value: string };
  info_googleEmail: { value: string };
  info_institutionEmail: { value: string };
  info_lastName: { value: string };
  info_middleName: { value: string };
  info_positionTitle: { value: string };
  info_primaryAffiliation: { value: string };
  info_suffix: { value: string };
  info_title: { value: string };
  info_website: { value: string };
  address_building: { value: string };
  address_cityAndProvince: { value: string };
  address_country: { value: string };
  address_streetAddress: { value: string };
  address_postalCode: { value: string };
}>;

export type FormSectionValidationState_Collaborators =
  FormSectionValidationState_SectionsGenericType<{}>;

export type FormSectionValidationState_DataAccessAgreements =
  FormSectionValidationState_SectionsGenericType<{
    agreements: {
      fields: {
        it_agreement_software_updates: FormFieldType;
        it_agreement_protect_data: FormFieldType;
        it_agreement_monitor_access: FormFieldType;
        it_agreement_destroy_copies: FormFieldType;
        it_agreement_onboard_training: FormFieldType;
        it_agreement_provide_institutional_policies: FormFieldType;
        it_agreement_contact_daco_fraud: FormFieldType;
        daa_correct_application_content: FormFieldType;
        daa_agree_to_terms: FormFieldType;
      };
    };
  }>;

export type FormSectionValidationState_EthicsLetter =
  FormSectionValidationState_SectionsGenericType<{
    approvalLetterDocs: { value: [] };
    declaredAsRequired: { value: boolean | null };
  }>;

export type FormSectionValidationState_ProjectInfo =
  FormSectionValidationState_SectionsGenericType<{
    aims: { value: string };
    background: { value: string };
    methodology: { value: string };
    publicationsURLs: {
      hasThreeValidURLs: boolean;
      value: Record<number, FormFieldType>;
    };
    summary: { value: string };
    title: { value: string };
    website: { value: string };
  }>;

export type FormSectionValidationState_Representative =
  FormSectionValidationState_SectionsGenericType<{
    info_firstName: { value: string };
    info_institutionEmail: { value: string };
    info_lastName: { value: string };
    info_middleName: { value: string };
    info_positionTitle: { value: string };
    info_primaryAffiliation: { value: string };
    info_suffix: { value: string };
    info_title: { value: string };
    address_building: { value: string };
    address_cityAndProvince: { value: string };
    address_country: { value: string };
    address_streetAddress: { value: string };
    address_postalCode: { value: string };
  }>;

export type FormSectionValidationState_Signature = FormSectionValidationState_SectionsGenericType<{
  signedApp: {
    fields: {
      name: string;
      objectId: string;
      uploadedAtUtc: string;
    };
  };
}>;

export type FormSectionValidationState_Terms = FormSectionValidationState_SectionsGenericType<{
  agreement: { value: boolean };
}>;

export type FormSectionValidationState_Sections =
  | FormSectionValidationState_Appendices
  | FormSectionValidationState_Applicant
  | FormSectionValidationState_Collaborators
  | FormSectionValidationState_DataAccessAgreements
  | FormSectionValidationState_EthicsLetter
  | FormSectionValidationState_ProjectInfo
  | FormSectionValidationState_Representative
  | FormSectionValidationState_Signature
  | FormSectionValidationState_Terms;

export type FormSectionValidationState_SectionBase = {
  fields: Partial<FormSectionValidationState_Sections>;
  meta: {
    overall: FORM_STATES;
    tooltips: Partial<Record<FormSectionOverallState, ReactNode>>;
  };
} & Partial<SchemaObjectDescription>;

export type FormValidationActionTypes =
  | 'array'
  | 'boolean'
  | 'string'
  | 'object'
  | 'overall'
  | 'remove'
  | 'seeding'
  | 'updating';

export type FormValidationAction = {
  error?: string[];
  field: string;
  overall: FormSectionOverallState;
  section: FormSectionNames;
  type: FormValidationActionTypes;
  value?: any;
};

interface FormValidationState_Base {
  appId: string;
  approvedAtUtc?: string;
  approvedBy?: string;
  closedAtUtc?: string;
  closedBy?: string;
  createdAtUtc?: string;
  denialReason?: string;
  expiresAtUtc?: string;
  lastUpdatedAtUtc?: string;
  revisionRequest: any; // temporary state
  state?: string; // called `state` in BE, but that complicates things in FE
  submittedAtUtc?: string;
  submitterId?: string;
  __refetchAllData: (action?: Partial<FormValidationAction>) => void;
  __seeded: boolean;
  __v: number;
}

export type FormValidationState_AllSectionsObj = Record<
  FormSectionNames,
  FormSectionValidationState_SectionBase
>;
export type FormValidationStateParameters = FormValidationState_Base & {
  sections: FormValidationState_AllSectionsObj;
};

export type FormSectionUpdateLocalStateFunction = (fieldData: FormValidationAction) => void;

export type FormFieldDataFromEvent = (event: ChangeEvent<HTMLInputElement>) =>
  | {
      eventType: string;
      field: string;
      fieldType: 'checkbox';
      value: boolean;
    }
  | {
      eventType: string;
      field: string;
      fieldType: 'file' | 'multiselect';
      value: any[];
    }
  | {
      eventType?: string;
      field?: string;
      fieldType?: string;
      value?: any;
    };

export type FormFieldValidationTriggerFunction = (event: any) => Promise<void>;
export type FormFieldValidatorFunction = (
  field?: string,
  value?: any,
  shouldPersistData?: Boolean,
) => Promise<FormValidationAction | void>;

export type FormSectionValidatorFunction_Origin = (
  origin: FormSectionNames,
  validateSection?: boolean,
) => FormFieldValidatorFunction;

export type FormSectionValidatorFunction_Main = (
  state: FormValidationStateParameters,
  dispatch: Dispatch<Partial<FormValidationAction>>,
  apiFetcher: AuthAPIFetchFunction,
) => FormSectionValidatorFunction_Origin;

export enum DOCUMENT_TYPES {
  SIGNED_APP = 'SIGNED_APP',
  ETHICS = 'ETHICS',
}
