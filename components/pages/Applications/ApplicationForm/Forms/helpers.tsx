import { isValidElement } from 'react';

import { FormSectionOverallStates, sectionsData } from './constants';
import { FormSectionNames, FormSectionValidatorFunction_Origin } from './types';
import { FormValidationStateParameters } from './types';

export const enabledSections = (
  sections: FormSectionNames[],
  state: FormValidationStateParameters,
) =>
  sections.filter(
    (sectionName) => !(state[sectionName]?.overall === FormSectionOverallStates.DISABLED),
  );

export const sectionSelector = (
  sectionName: FormSectionNames,
  {
    state,
    validator,
  }: { state: FormValidationStateParameters; validator: FormSectionValidatorFunction_Origin },
) => {
  const SectionComponent = sectionsData[sectionName]?.component;
  const { fields: storedFields = {}, overall = FormSectionOverallStates.PRISTINE } =
    state[sectionName] || {};

  const isSectionDisabled = [
    FormSectionOverallStates.DISABLED || FormSectionOverallStates.LOCKED,
  ].includes(overall);

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
