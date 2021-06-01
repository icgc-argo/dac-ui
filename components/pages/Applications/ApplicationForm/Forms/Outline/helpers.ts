import { FORM_STATES } from '../types';

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
    case FORM_STATES.COMPLETE:
      return {
        iconName: 'checkmark',
        tagVariant: TAG_VARIANTS.SUCCESS,
      };

    case FORM_STATES.INCOMPLETE:
      return {
        iconName: 'exclamation',
        tagVariant: TAG_VARIANTS.ERROR,
      };

    case FORM_STATES.CANEDIT:
      return {
        iconName: 'edit',
        tagVariant: TAG_VARIANTS.EDITABLE,
      };

    case FORM_STATES.MUSTEDIT:
      return {
        iconName: 'edit',
        tagVariant: TAG_VARIANTS.WARNING,
      };

    case FORM_STATES.LOCKED:
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
