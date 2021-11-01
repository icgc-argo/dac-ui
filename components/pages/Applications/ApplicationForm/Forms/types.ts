/*
 * Copyright (c) 2021 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { ChangeEvent, Dispatch, ReactNode } from 'react';
import { SchemaDescription, SchemaObjectDescription } from 'yup/lib/schema';
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
  MODAL = 'MODAL',
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
  REVISIONS_MADE = 'revisionsMade',
  REVISIONS_REQUESTED_DISABLED = 'revisionsRequestedDisabled',
}

export type SectionStatusMapping = Record<SECTION_STATUS, FormSectionOverallState>;

export type FormSectionOverallState = `${FORM_STATES}`;

export type ValidationConfigType = {
  iconName: UikitIconNames;
  tagVariant: keyof typeof TAG_VARIANTS;
};

export { TAG_VARIANTS };

export type FormFieldType = Partial<
  SchemaDescription & {
    innerType: FormFieldType;
    error: string[];
    fields: any;
    touched: boolean;
    value: any;
  } & {
    // WIP: this handles shape mutations (validation vs persistence)
    meta: {
      filler?: '';
      skipValidation: boolean;
      shape: 'collection' | 'modal' | 'publicationURLsArray' | 'singleAcceptance';
      type: 'boolean' | 'string';
    };
  }
>;

type FormSectionValidationState_SectionsGenericType<
  T extends Record<string, FormFieldType>
> = Record<string, Partial<T[keyof T] & FormFieldType>>;

export type FormSectionValidationState_Appendices = FormSectionValidationState_SectionsGenericType<{
  agreements: {
    fields: {
      appendix_icgc_goals_policies: FormFieldType;
      appendix_data_access_policy: FormFieldType;
      appendix_ip_policy: FormFieldType;
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

export type FormSectionValidationState_Collaborators = FormSectionValidationState_SectionsGenericType<{
  list: {
    value: [
      {
        id: { value: string };
        info_firstName: { value: string };
        info_googleEmail: { value: string };
        info_institutionEmail: { value: string };
        info_lastName: { value: string };
        info_middleName: { value: string };
        info_positionTitle: { value: string };
        info_primaryAffiliation: { value: string };
        info_suffix: { value: string };
        info_title: { value: string };
        type: { value: string };
      },
    ];
  };
}>;

export type FormSectionValidationState_DataAccessAgreements = FormSectionValidationState_SectionsGenericType<{
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

export type FormSectionValidationState_EthicsLetter = FormSectionValidationState_SectionsGenericType<{
  approvalLetterDocs: { value: [] };
  declaredAsRequired: { value: boolean | null };
}>;

export type FormSectionValidationState_ProjectInfo = FormSectionValidationState_SectionsGenericType<{
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

export type FormSectionValidationState_Representative = FormSectionValidationState_SectionsGenericType<{
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
    errorsList: {
      field: string;
      message: string;
    }[];
    overall: FORM_STATES;
    showOverall: boolean;
    tooltips: Partial<Record<FormSectionOverallState, ReactNode>>;
    validated: boolean;
  };
} & Partial<SchemaObjectDescription>;

export type FormValidationActionTypes =
  | 'array'
  | 'boolean'
  | 'clearModal'
  | 'feedModal'
  | 'object'
  | 'remove'
  | 'sectionOverall'
  | 'seeding'
  | 'string'
  | 'updating';

export type FormValidationAction = {
  error?: any;
  field: string;
  fieldType?: string;
  section: FormSectionNames;
  type: FormValidationActionTypes;
  value?: any;
};

export type RefetchDataFunction = (action?: Partial<FormValidationAction>) => void;
export interface FormValidationState_Base {
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
  __refetchAllData: RefetchDataFunction;
  __v: number;
}

export type FormValidationState_AllSectionsObj = Record<
  FormSectionNames,
  FormSectionValidationState_SectionBase
>;
export type FormValidationStateParameters = FormValidationState_Base & {
  sections: FormValidationState_AllSectionsObj;
  __seeded: boolean;
};

export type FormSectionUpdateLocalStateFunction = (fieldData: FormValidationAction[]) => void;

export type FormFieldDataFromEvent = (
  event: ChangeEvent<HTMLInputElement>,
) =>
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

export type FormValidationFunctionArguments = {
  field?: string;
  value?: any;
  shouldPersistResults?: Boolean;
};

export type FormFieldValidatorFunction = (
  fieldsToValidate?: FormValidationFunctionArguments[],
) => Promise<FormValidationAction[] | undefined>;

export type FormSectionValidationTriggerReasons = 'initialValidation' | 'notShowingOverall';

export type FormSectionValidatorFunction_Origin = (
  origin: FormSectionNames,
  reasonToValidate?: FormSectionValidationTriggerReasons,
) => FormFieldValidatorFunction;

export type FormSectionValidatorFunction_Main = (
  state: FormValidationStateParameters,
  dispatch: Dispatch<Partial<FormValidationAction>>,
  apiFetcher: AuthAPIFetchFunction,
) => FormSectionValidatorFunction_Origin;

export enum DOCUMENT_TYPES {
  SIGNED_APP = 'SIGNED_APP',
  ETHICS = 'ETHICS',
  APPROVED_PDF = 'APPROVED_PDF',
}

enum DacoRole {
  SUBMITTER = 'SUBMITTER',
  ADMIN = 'ADMIN',
}

type UpdateAuthor = {
  role: DacoRole;
};

enum AppType {
  NEW = 'NEW',
  RENEWAL = 'RENEWAL',
}

interface ApplicationInfo {
  appType: AppType;
}

// to differentiate update events from app State
export enum UpdateEvent {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  PAUSED = 'PAUSED',
  REVISIONS_REQUESTED = 'REVISIONS REQUESTED',
  ATTESTED = 'ATTESTED',
  APPROVED = 'APPROVED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED',
}

export interface UserViewApplicationUpdate {
  author: Partial<UpdateAuthor>;
  eventType: UpdateEvent;
  date: Date;
  applicationInfo: Partial<ApplicationInfo>;
}
