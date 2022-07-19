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
  country: string;
  currentApprovedAppDoc: boolean;
  attestedAtUtc: string;
  attestationByUtc: string;
  isAttestable: boolean;
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
  PAUSED = 'PAUSED',
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
  includeStats?: boolean;
  query?: string;
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
    address: {
      country: string;
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
  revisionsRequested: boolean;
  currentApprovedAppDoc: boolean;
  attestedAtUtc: string;
  attestationByUtc: string;
  isAttestable: boolean;
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
export interface Meta {
  status: string;
  errorsList: string[];
  updated?: boolean;
  lastUpdatedAtUtc?: string;
}

interface Individual {
  address: Address;
  info: IndividualInfo;
  meta: Meta;
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
  meta: Meta;
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
  meta: Meta;
}

interface Collaborators {
  list: Collaborator[];
  meta: Meta;
}

interface EthicsLetter {
  declaredAsRequired: boolean;
  approvalLetterDocs: ApprovalDoc[];
  meta: Meta;
}

export interface DataAccessAgreement {
  agreements: DataAccessAgreement[];
  meta: Meta;
}

export enum AppendixEnum {
  ICGC_GOALS_POLICIES = 'appendix_icgc_goals_policies',
  DATA_ACCESS_POLICY = 'appendix_data_access_policy',
  IP_POLICY = 'appendix_ip_policy',
}

export interface AppendixAgreement extends Agreement {
  name: AppendixEnum;
}

interface Appendices {
  agreements: AppendixAgreement[];
  meta: Meta;
}

interface Signature {
  meta: Meta;
  signedDocName: string;
  signedAppDocObjId: string;
  uploadedAtUtc: string;
}
export interface ApplicationData {
  appId: string;
  approvedAppDocs: ApprovedDoc[];
  createdAtUtc: string;
  lastUpdatedAtUtc: string;
  expiresAtUtc: string;
  closedAtUtc: string;
  revisionsRequested: boolean;
  approvedAtUtc: string;
  state: ApplicationState;
  isAttestable: boolean;
  attestedAtUtc: string;
  attestationByUtc: string;
  sections: {
    applicant: Individual;
    representative: Representative;
    collaborators: Collaborators;
    projectInfo: ProjectInfo;
    ethicsLetter: EthicsLetter;
    dataAccessAgreement: DataAccessAgreement;
    appendices: Appendices;
    signature: Signature;
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
  appNumber = 'appNumber',
  'applicant.address.country' = 'country',
  currentApprovedAppDoc = 'currentApprovedAppDoc',
  attestedAtUtc = 'attestedAtUtc',
}

export type AuthAPIFetchFunction = (options?: {
  data?: any;
  method?: Method;
}) => Promise<AxiosResponse<any>>;

export type ApprovedDoc = {
  approvedAppDocObjId: string;
  uploadedAtUtc: string;
  approvedAppDocName: string;
  isCurrent: boolean;
  approvedAtUtc: string;
};
