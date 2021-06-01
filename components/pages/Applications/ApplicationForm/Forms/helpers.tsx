import { isValidElement } from 'react';

import { sectionsData } from './constants';
import { FormSectionNames, FormSectionValidatorFunction_Origin } from './types';
import { FORM_STATES, FormValidationStateParameters } from './types';

export const enabledSections = (
  sections: FormSectionNames[],
  state: FormValidationStateParameters,
) => sections.filter((sectionName) => !(state[sectionName]?.overall === FORM_STATES.DISABLED));

export const sectionSelector = (
  sectionName: FormSectionNames,
  {
    state,
    validator,
  }: { state: FormValidationStateParameters; validator: FormSectionValidatorFunction_Origin },
) => {
  const SectionComponent = sectionsData[sectionName]?.component;
  const { fields: storedFields = {}, overall } = state[sectionName] || {};

  const isSectionDisabled = [FORM_STATES.DISABLED || FORM_STATES.LOCKED].includes(overall);

  return SectionComponent && isValidElement(<SectionComponent />) ? (
    <SectionComponent
      isSectionDisabled={isSectionDisabled}
      overall={overall}
      storedFields={storedFields}
      validateSection={validator}
    />
  ) : (
    `Section not implemented: "${sectionName}"`
  );
};
