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

import { isValidElement } from 'react';
import { pickBy } from 'lodash';

import Loader from 'components/Loader';
import { sectionsData } from './constants';
import {
  FORM_STATES,
  FormSectionNames,
  FormSectionValidationState_Sections,
  FormSectionValidatorFunction_Origin,
  FormValidationStateParameters,
  FormSectionValidationState_SectionBase,
} from './types';
import { TERMS_PLACEHOLDER_FORM_DATA, useLocalValidation } from './validations';
import { ApplicationData } from '../../types';
import { isBefore } from 'date-fns';

export const enabledSections = (
  sections: FormSectionNames[],
  state: FormValidationStateParameters,
) =>
  sections.filter(
    (sectionName) => !(state.sections[sectionName]?.meta.overall === FORM_STATES.DISABLED),
  );

export const sectionSelector = ({
  formState,
  isLoading,
  selectedSection,
  validator,
  appId,
  sectionData,
}: {
  formState: FormValidationStateParameters;
  isLoading: boolean;
  selectedSection: FormSectionNames;
  validator: FormSectionValidatorFunction_Origin;
  appId: string;
  sectionData: ApplicationData['sections'];
}) => {
  const SectionComponent = sectionsData[selectedSection]?.component;
  const {
    fields: storedFields,
    meta: { overall },
  }: FormSectionValidationState_SectionBase =
    selectedSection === 'terms'
      ? (TERMS_PLACEHOLDER_FORM_DATA as FormSectionValidationState_SectionBase)
      : formState.sections[selectedSection];

  const isSectionDisabled =
    !overall ||
    [FORM_STATES.DISABLED, FORM_STATES.LOCKED, FORM_STATES.REVISIONS_REQUESTED_DISABLED].includes(
      overall,
    );

  const {
    localState,
    validateFieldTouched,
  }: {
    localState: FormSectionValidationState_Sections;
    validateFieldTouched: (event: any) => void;
  } = useLocalValidation(selectedSection, storedFields, validator(selectedSection));

  const applicantAddress =
    selectedSection === 'representative' && !!localState.addressSameAsApplicant?.value
      ? pickBy(formState.sections.applicant?.fields || {}, (value, key) =>
          key.startsWith('address_'),
        )
      : undefined; // undefined prop won't be passed down
  const primaryAffiliation = formState.sections.applicant.fields.info_primaryAffiliation.value;

  return isLoading || !formState.__seeded ? (
    <Loader />
  ) : SectionComponent && isValidElement(<SectionComponent />) ? (
    <SectionComponent
      applicantAddress={applicantAddress}
      appId={appId}
      applicationState={formState.state}
      isSectionDisabled={isSectionDisabled}
      localState={localState}
      primaryAffiliation={primaryAffiliation}
      refetchAllData={formState.__refetchAllData}
      validateFieldTouched={validateFieldTouched}
      sectionLastUpdatedAt={
        selectedSection === 'terms' ? null : sectionData[selectedSection].meta.lastUpdatedAtUtc
      }
      errorsList={selectedSection === 'terms' ? [] : sectionData[selectedSection].meta.errorsList}
    />
  ) : (
    `Section not implemented: "${selectedSection}"`
  );
};
