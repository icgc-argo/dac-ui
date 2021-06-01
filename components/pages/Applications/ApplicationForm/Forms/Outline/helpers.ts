import { FormSectionOverallStates } from '../constants';

import { FormSectionOverallState, TAG_VARIANTS, ValidationConfigType } from '../types';

// <Tag> colour reference:
//   DISABLED: #a1a4b1
//   ERROR: #df1b42
//   HIGHLIGHT: #9bc7ed
//   INFO: #0774d3
//   NEUTRAL: #  #dcdde1
//   SUCCESS: #00C79D
//   UPDATE: #00b3d3
//   WARNING: #fea430
//   EDITABLE: #7f55cc

export const getValidationUIConfig = (status: FormSectionOverallState): ValidationConfigType => {
  switch (status) {
    case FormSectionOverallStates.COMPLETE:
      return {
        iconName: 'checkmark',
        tagVariant: TAG_VARIANTS.SUCCESS,
      };

    case FormSectionOverallStates.INCOMPLETE:
      return {
        iconName: 'exclamation',
        tagVariant: TAG_VARIANTS.ERROR,
      };

    case FormSectionOverallStates.CANEDIT:
      return {
        iconName: 'edit',
        tagVariant: TAG_VARIANTS.EDITABLE,
      };

    case FormSectionOverallStates.MUSTEDIT:
      return {
        iconName: 'edit',
        tagVariant: TAG_VARIANTS.WARNING,
      };

    case FormSectionOverallStates.LOCKED:
      return {
        iconName: 'lock',
        tagVariant: TAG_VARIANTS.DISABLED,
      };

    default:
      return {
        iconName: 'question',
        tagVariant: TAG_VARIANTS.NEUTRAL,
      };
  }
};

export type { FormSectionOverallState } from '../types';
