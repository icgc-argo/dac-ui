import { Dispatch, useCallback, useEffect, useReducer, useState } from 'react';
import { debounce } from 'lodash';

import { handleFieldTypes } from './helpers';
import yup, { combinedSchema } from './schemas';
import {
  FormFieldType,
  FormSectionValidationState_Sections,
  FormSectionValidatorFunction_Field,
  FormSectionValidatorFunction_Main,
  FormValidationAction,
  FormValidationStateParameters,
} from '../types';

export const validationReducer = (
  state: FormValidationStateParameters,
  action: FormValidationAction,
): FormValidationStateParameters => {
  switch (action.type) {
    case 'boolean': {
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          ...(action.overall &&
            state[action.section]?.overall === 'pristine' && { overall: action.overall }),
          fields: {
            ...state[action.section]?.fields,
            [action.field]: {
              ...state[action.section]?.fields?.[action.field],
              error: action.error || undefined,
              value: action.value,
            },
          },
        },
      };
    }

    case 'overall': {
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          overall: action.overall,
        },
      };
    }

    default:
      return state;
  }
};

export const validator: FormSectionValidatorFunction_Main =
  (dispatch) => (origin, validationState) => async (field, value, setLocalState) => {
    if (field) {
      try {
        const fieldSchema = await yup.reach(combinedSchema[origin], field);

        const { error } = await fieldSchema.validate(value).catch((error: yup.ValidationError) => ({
          error: error?.errors?.length > 0 ? error.errors : error.message,
        }));

        (setLocalState || dispatch)({
          field,
          section: origin,
          type: fieldSchema.describe().type,
          value,
          ...(error && { error }),
          ...(!setLocalState && { overall: 'touched' }),
        } as FormValidationAction);
      } catch (error) {
        console.error(error);
      }
    } else if (validationState) {
      const { error, ...response } =
        (await combinedSchema[origin]
          ?.validate(
            Object.entries(validationState[origin]?.fields as object).reduce(
              (acc, [field, data]) => ({
                ...acc,
                [field]: data.value,
              }),
              {},
            ),
          )
          .catch((error: yup.ValidationError) => {
            return {
              error: error?.errors?.length > 0 ? error.errors : error.message,
            };
          })) || {};

      dispatch({
        section: origin,
        type: 'overall',
        overall: error
          ? 'incomplete'
          : !['', 'disabled', 'pristine'].includes(validationState[origin]?.overall || '')
          ? 'complete'
          : undefined,
        value,
        ...(error && { error }),
      } as FormValidationAction);
    }

    return Promise.resolve();
  };

export const useFormValidation = (appId: string) => {
  const [validationState, validationDispatch]: [
    FormValidationStateParameters,
    Dispatch<FormValidationAction>,
  ] = useReducer(validationReducer, {
    id: appId,
    ...Object.entries(combinedSchema).reduce(
      (acc, [field, schema]) => ({
        ...acc,
        [field]: {
          ...(schema?.describe?.() || schema),
          overall: 'pristine',
        },
      }),
      {},
    ),
    signature: {
      ...combinedSchema.signature.describe(),
      overall: 'disabled',
    },
    version: 0,
  } as FormValidationStateParameters);

  const validateSection = validator(validationDispatch);

  return {
    validationState,
    validateSection,
  };
};

export const isRequired = (fieldData?: FormFieldType) =>
  fieldData?.tests?.some((test) => test.name === 'required');

export const useLocalValidation = (
  storedFields: FormSectionValidationState_Sections,
  sectionValidator: FormSectionValidatorFunction_Field,
) => {
  const [localState, setLocalState] = useState(storedFields);
  const [fieldsTouched, setFieldTouched] = useState(
    new Set<string>(
      Object.entries(storedFields).reduce(
        (acc: string[], [field, data]) => (data?.value ? [...acc, field] : acc),
        [],
      ),
    ),
  );

  useEffect(() => {
    setLocalState(storedFields);
  }, [storedFields]);

  useEffect(() => {
    fieldsTouched.forEach((field) => {
      const fieldData: FormFieldType =
        localState[field as keyof FormSectionValidationState_Sections] || {};

      setLocalState((prev) => ({
        ...prev,
        [field]: {
          ...fieldData,
        },
      }));
    });
  }, [fieldsTouched]);

  const updateLocalState = useCallback(
    ({ error, field, value }: FormValidationAction) => {
      setLocalState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          error,
          value,
        },
      }));
    },
    [localState],
  );

  const validateFieldTouched = (event: any): void => {
    const { field, type, value } = handleFieldTypes(event);

    if (field && type) {
      switch (type) {
        case 'change':
          setLocalState(
            (prev) =>
              ({
                ...prev,
                [field]: {
                  ...((prev[field as keyof FormSectionValidationState_Sections] || {}) as object),
                  value,
                },
              } as FormSectionValidationState_Sections),
          );

          sectionValidator(field, value);
          break;

        case 'blur':
          sectionValidator(field, value, updateLocalState).then(() => {
            setFieldTouched((prev) => new Set(prev.add(field)));
          });
          break;
      }
    }
  };

  return {
    localState,
    validateFieldTouched,
  };
};
