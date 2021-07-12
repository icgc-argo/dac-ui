import { isValidElement } from 'react';

import Loader from 'components/Loader';

import { sectionsData } from './constants';
import {
  FORM_STATES,
  FormSectionNames,
  FormSectionValidationState_Sections,
  FormSectionValidatorFunction_Origin,
  FormValidationStateParameters,
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
}: {
  formState: FormValidationStateParameters;
  isLoading: boolean;
  selectedSection: FormSectionNames;
  validator: FormSectionValidatorFunction_Origin;
}) => {
  const SectionComponent = sectionsData[selectedSection]?.component;
  const {
    fields: storedFields = {},
    meta: { overall },
  } = formState.sections[selectedSection] || {};

  const isSectionDisabled = [FORM_STATES.DISABLED, FORM_STATES.LOCKED].includes(overall);

  const {
    localState,
    validateFieldTouched,
  }: {
    localState: FormSectionValidationState_Sections;
    validateFieldTouched: (event: any) => void;
  } = useLocalValidation(selectedSection, storedFields, validator(selectedSection));

  return isLoading || !formState.__seeded ? (
    <Loader />
  ) : SectionComponent && isValidElement(<SectionComponent />) ? (
    <SectionComponent
      isSectionDisabled={isSectionDisabled}
      localState={localState}
      state={formState.state}
      validateFieldTouched={validateFieldTouched}
    />
  ) : (
    `Section not implemented: "${selectedSection}"`
  );
};
