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

  const primaryAffiliation = formState.sections.applicant.fields.info_primaryAffiliation.value;

  return isLoading || !formState.__seeded ? (
    <Loader />
  ) : SectionComponent && isValidElement(<SectionComponent />) ? (
    <SectionComponent
      appId={appId}
      applicationState={formState.state}
      isSectionDisabled={isSectionDisabled}
      localState={localState}
      primaryAffiliation={primaryAffiliation}
      refetchAllData={formState.__refetchAllData}
      validateFieldTouched={validateFieldTouched}
    />
  ) : (
    `Section not implemented: "${selectedSection}"`
  );
};
