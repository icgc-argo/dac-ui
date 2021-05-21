import { Dispatch, useCallback, useReducer } from 'react';

import { ValidationActionType, ValidationParametersType } from './types';

export const validationReducer = (
  state: ValidationParametersType,
  action: ValidationActionType,
): ValidationParametersType => {
  switch (action.type) {
    default:
      console.log('dispatched nothing', action);
      return state;
  }
};

export const validator = (
  state: ValidationParametersType,
  dispatch: Dispatch<ValidationActionType>,
) => (file: File): void => {
};

export const useFormValidation = () => {
  const [validationState, validationDispatch] = useReducer(validationReducer, {
    applicant: { overall: 'complete' },
    collaborators: { overall: 'canEdit' },
    ethics: { overall: 'disabled' },
    introduction: { overall: 'complete' },
    it: { overall: 'locked' },
    project: { overall: 'mustEdit' },
    representative: { overall: 'incomplete' },
    signature: { overall: 'disabled' },
  });
  const validateSection = useCallback(validator(validationState, validationDispatch), [validationDispatch, validationState]);

  return {
    validationState,
    validateSection,
  }
}

export * from './types';
