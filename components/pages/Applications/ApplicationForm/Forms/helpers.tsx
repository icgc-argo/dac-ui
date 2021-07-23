import { isValidElement } from 'react';

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
import { useLocalValidation } from './validations';
import { pickBy } from 'lodash';

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
}: {
  formState: FormValidationStateParameters;
  isLoading: boolean;
  selectedSection: FormSectionNames;
  validator: FormSectionValidatorFunction_Origin;
  appId: string;
}) => {
  const SectionComponent = sectionsData[selectedSection]?.component;
  const {
    fields: storedFields,
    meta: { overall },
  }: FormSectionValidationState_SectionBase = formState.sections[selectedSection] || {};

  const isSectionDisabled =
    !overall || [FORM_STATES.DISABLED, FORM_STATES.LOCKED].includes(overall);

  const {
    localState,
    validateFieldTouched,
  }: {
    localState: FormSectionValidationState_Sections;
    validateFieldTouched: (event: any) => void;
  } = useLocalValidation(selectedSection, storedFields, validator(selectedSection));

  const applicantAddress = selectedSection === 'representative' && !!localState.addressSameAsApplicant?.value
    ? pickBy(formState.sections.applicant?.fields || {}, (value, key) => key.startsWith('address_'))
    : undefined; // undefined prop won't be passed down

  return isLoading || !formState.__seeded ? (
    <Loader />
  ) : SectionComponent && isValidElement(<SectionComponent />) ? (
    <SectionComponent
      applicantAddress={applicantAddress}
      isSectionDisabled={isSectionDisabled}
      localState={localState}
      refetchAllData={formState.__refetchAllData}
      state={formState.state}
      validateFieldTouched={validateFieldTouched}
      appId={appId}
    />
  ) : (
    `Section not implemented: "${selectedSection}"`
  );
};
