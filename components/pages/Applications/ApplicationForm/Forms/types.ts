import { ChangeEvent, Dispatch, ReactNode } from 'react';
import {
  SchemaDescription,
  SchemaInnerTypeDescription,
  SchemaObjectDescription,
} from 'yup/lib/schema';
import { UikitIconNames } from '@icgc-argo/uikit/Icon/icons';
import { TAG_VARIANTS } from '@icgc-argo/uikit/Tag';

import { countriesList, honorificsList, sectionsOrder } from './constants';

export type CountryNamesAndAbbreviations = typeof countriesList[number];
export type FormSectionNames = typeof sectionsOrder[number];
export type HonorificsListTypes = typeof honorificsList[number];

export enum EVENT_TARGET_TAGS {
  INPUT = 'INPUT',
  MULTISELECT = 'MULTISELECT',
  SELECT = 'SELECT',
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
      hidden: boolean; // added for array handling consistency (a.k.a "remove")
      touched: boolean;
      value: any;
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
  info_institutionWebsite: { value: string };
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
  address_street: { value: string };
  address_postalCod: { value: string };
}>;
export type FormSectionValidationState_Collaborators =
  FormSectionValidationState_SectionsGenericType<{}>;
export type FormSectionValidationState_DataAccessAgreements =
  FormSectionValidationState_SectionsGenericType<{
    agreements: {
      fields: {
        daa_correct_application_content: FormFieldType;
        daa_agree_to_terms: FormFieldType;
      };
    };
  }>;
export type FormSectionValidationState_Ethics = FormSectionValidationState_SectionsGenericType<{}>;
export type FormSectionValidationState_Introduction =
  FormSectionValidationState_SectionsGenericType<{
    agreement: { value: boolean };
  }>;
export type FormSectionValidationState_ITAgreements =
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
        it_agreement_cloud_usage_risk: FormFieldType;
        it_agreement_read_cloud_appendix: FormFieldType;
      };
    };
  }>;
export type FormSectionValidationState_Project = FormSectionValidationState_SectionsGenericType<{}>;
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
    address_street: { value: string };
    address_postalCod: { value: string };
  }>;
export type FormSectionValidationState_Signature =
  FormSectionValidationState_SectionsGenericType<{}>;

export type FormSectionValidationState_Sections =
  | FormSectionValidationState_Appendices
  | FormSectionValidationState_Applicant
  | FormSectionValidationState_Collaborators
  | FormSectionValidationState_DataAccessAgreements
  | FormSectionValidationState_Ethics
  | FormSectionValidationState_Introduction
  | FormSectionValidationState_Project
  | FormSectionValidationState_ITAgreements
  | FormSectionValidationState_Representative
  | FormSectionValidationState_Signature;

export type FormSectionValidationState_SectionBase = {
  fields: Partial<FormSectionValidationState_Sections>;
  overall: FORM_STATES;
  tooltips: Partial<Record<FormSectionOverallState, ReactNode>>;
} & Partial<SchemaObjectDescription>;

export type FormValidationActionTypes = 'array' | 'boolean' | 'string' | 'object' | 'overall';

export type FormValidationAction = {
  error?: string[];
  field: string;
  overall: FormSectionOverallState;
  section: FormSectionNames;
  type: FormValidationActionTypes;
  value?: any;
};

interface FormValidationState_Base {
  approvedAtUtc?: string;
  approvedBy?: string;
  closedAtUtc?: string;
  closedBy?: string;
  createdAtUtc?: string;
  denialReason?: string;
  expiresAtUtc?: string;
  id: string;
  state?: string;
  submittedAtUtc?: string;
  submitterId?: string;
  updatedAtUtc?: string;
  version: number;
}

export type FormValidationStateParameters = FormValidationState_Base &
  Record<FormSectionNames, FormSectionValidationState_SectionBase>;

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
      fieldType: 'multiselect';
      value: any[];
    }
  | {
      eventType?: string;
      field?: string;
      fieldType?: string;
      value?: string;
    };

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
  dispatch: Dispatch<FormValidationAction>,
) => FormSectionValidatorFunction_Origin;
