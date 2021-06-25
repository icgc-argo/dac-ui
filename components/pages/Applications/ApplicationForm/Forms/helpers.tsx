import { isValidElement } from 'react';

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
    (sectionName) => !(state.sections[sectionName]?.overall === FORM_STATES.DISABLED),
  );

export const sectionSelector = (
  sectionName: FormSectionNames,
  {
    formState,
    validator,
  }: { formState: FormValidationStateParameters; validator: FormSectionValidatorFunction_Origin },
) => {
  const SectionComponent = sectionsData[sectionName]?.component;
  const { fields: storedFields = {}, overall } = formState.sections[sectionName] || {};

  const isSectionDisabled = [FORM_STATES.DISABLED || FORM_STATES.LOCKED].includes(overall);

  const {
    localState,
    validateFieldTouched,
  }: {
    localState: FormSectionValidationState_Sections;
    validateFieldTouched: (event: any) => void;
  } = useLocalValidation(storedFields, validator(sectionName));

  return SectionComponent && isValidElement(<SectionComponent />) ? (
    <SectionComponent
      isSectionDisabled={isSectionDisabled}
      localState={localState}
      validateFieldTouched={validateFieldTouched}
    />
  ) : (
    `Section not implemented: "${sectionName}"`
  );
};
