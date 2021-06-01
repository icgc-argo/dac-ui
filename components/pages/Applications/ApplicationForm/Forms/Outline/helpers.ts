import { UikitIconNames } from '@icgc-argo/uikit/Icon/icons';
import { TAG_VARIANTS } from '@icgc-argo/uikit/Tag';

import { FormSectionOverallStates } from '../types';

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

type ValidationConfigType = {
  iconName: UikitIconNames;
  tagVariant: keyof typeof TAG_VARIANTS;
};

export const getValidationUIConfig = (status: FormSectionOverallStates): ValidationConfigType => {
  switch (status) {
    case 'complete':
      return {
        iconName: 'checkmark',
        tagVariant: TAG_VARIANTS.SUCCESS,
      };

    case 'incomplete':
      return {
        iconName: 'exclamation',
        tagVariant: TAG_VARIANTS.ERROR,
      };

    case 'canEdit':
      return {
        iconName: 'edit',
        tagVariant: TAG_VARIANTS.EDITABLE,
      };

    case 'mustEdit':
      return {
        iconName: 'edit',
        tagVariant: TAG_VARIANTS.WARNING,
      };

    case 'locked':
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

export type { FormSectionOverallStates } from '../types';
