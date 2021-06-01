import { Dispatch, ReactNode } from 'react';
import { SchemaDescription, SchemaObjectDescription } from 'yup/lib/schema';

import { sectionsOrder } from './constants';

export type FormSectionNames = typeof sectionsOrder[number];

export type FormSectionOverallStates =
  | 'canEdit'
  | 'complete'
  | 'disabled'
  | 'incomplete'
  | 'locked'
  | 'mustEdit'
  | 'touched'
  | 'pristine';

export type FormFieldType = {
  error?: string[];
  touched?: boolean;
  value?: any;
} & Partial<SchemaDescription>;

type FormSectionValidationState_SectionsGenericType<T extends Record<string, FormFieldType>> =
  Record<string, T[keyof T] & FormFieldType>;

export type FormSectionValidationState_Appendices =
  FormSectionValidationState_SectionsGenericType<{}>;
export type FormSectionValidationState_Applicant =
  FormSectionValidationState_SectionsGenericType<{}>;
export type FormSectionValidationState_Collaborators =
  FormSectionValidationState_SectionsGenericType<{}>;
export type FormSectionValidationState_Data = FormSectionValidationState_SectionsGenericType<{}>;
export type FormSectionValidationState_Ethics = FormSectionValidationState_SectionsGenericType<{}>;
export type FormSectionValidationState_Introduction =
  FormSectionValidationState_SectionsGenericType<{
    agreement_accepted: { value: boolean };
  }>;
export type FormSectionValidationState_IT = FormSectionValidationState_SectionsGenericType<{}>;
export type FormSectionValidationState_Project = FormSectionValidationState_SectionsGenericType<{}>;
export type FormSectionValidationState_Representative =
  FormSectionValidationState_SectionsGenericType<{}>;
export type FormSectionValidationState_Signature =
  FormSectionValidationState_SectionsGenericType<{}>;

export type FormSectionValidationState_Sections =
  | FormSectionValidationState_Appendices
  | FormSectionValidationState_Applicant
  | FormSectionValidationState_Collaborators
  | FormSectionValidationState_Data
  | FormSectionValidationState_Ethics
  | FormSectionValidationState_Introduction
  | FormSectionValidationState_IT
  | FormSectionValidationState_Project
  | FormSectionValidationState_Representative
  | FormSectionValidationState_Signature;

export type FormSectionValidationState_SectionBase = {
  fields?: Partial<FormSectionValidationState_Sections>;
  overall?: FormSectionOverallStates;
  tooltips?: Partial<Record<FormSectionOverallStates, ReactNode>>;
} & Partial<SchemaObjectDescription>;

export type FormValidationActionTypes = 'boolean' | 'overall';

export type FormValidationAction = {
  error?: string[];
  field: string;
  overall: FormSectionOverallStates;
  section: FormSectionNames;
  type: FormValidationActionTypes;
  value?: any;
};

interface FormValidationState_Base {
  id: string;
  version: number;
}

export type FormValidationStateParameters = FormValidationState_Base &
  Partial<Record<FormSectionNames, FormSectionValidationState_SectionBase>>;

export type FormSectionUpdateLocalStateFunction = (fieldData: FormValidationAction) => void;

export type FormSectionValidatorFunction_Field = (
  field?: string,
  value?: any,
  updateLocalState?: FormSectionUpdateLocalStateFunction,
) => Promise<string | void>;
export type FormSectionValidatorFunction_Origin = (
  origin: FormSectionNames,
  state?: FormValidationStateParameters,
) => FormSectionValidatorFunction_Field;
export type FormSectionValidatorFunction_Main = (
  dispatch: Dispatch<FormValidationAction>,
) => FormSectionValidatorFunction_Origin;
