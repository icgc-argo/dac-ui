import { Dispatch, useCallback, useEffect, useReducer, useState } from 'react';

import { getFieldDataFromEvent, schemaValidator } from './helpers';
import yup, { combinedSchema } from './schemas';
import {
  FormFieldType,
  FormSectionValidationState_Sections,
  FormFieldValidatorFunction,
  FormSectionValidatorFunction_Main,
  FormValidationAction,
  FormValidationStateParameters,
} from '../types';

export const validationReducer = (
  state: FormValidationStateParameters,
  action: FormValidationAction,
): FormValidationStateParameters => {
  switch (action.type) {
    case 'boolean':
    case 'string': {
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
  (validationState, dispatch) =>
  (origin, validateSection) =>
  async (field, value, shouldPersistResults) => {
    if (validateSection) {
      const { error } = await schemaValidator(
        combinedSchema[origin],
        Object.entries(validationState[origin]?.fields as object).reduce(
          (acc, [field, data]) => ({
            ...acc,
            [field]: data.value,
          }),
          {},
        ),
      );

      const results = {
        section: origin,
        type: 'overall',
        overall: error
          ? 'incomplete'
          : !['', 'disabled', 'pristine'].includes(validationState[origin]?.overall || '')
          ? 'complete'
          : undefined,
        ...(error && { error }),
      } as FormValidationAction;
      dispatch(results);

      return results;
    } else if (field) {
      const { error } = await schemaValidator(yup.reach(combinedSchema[origin], field), value);

      const results = {
        ...(error && { error }),
        field,
        ...(shouldPersistResults && { overall: 'touched' }),
        section: origin,
        type: validationState[origin]?.fields?.[field]?.type,
        value,
      } as FormValidationAction;

      shouldPersistResults && dispatch(results);

      return results;
    }
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

  const validateSection = validator(validationState, validationDispatch);

  return {
    validationState,
    validateSection,
  };
};

export const isRequired = (fieldData?: FormFieldType) =>
  fieldData?.tests?.some((test) => test.name === 'required');

export const useLocalValidation = (
  storedFields: FormSectionValidationState_Sections,
  fieldValidator: FormFieldValidatorFunction,
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

  const updateLocalState = useCallback(
    ({ error, field, value }: FormValidationAction) => {
      fieldsTouched.has(field) || setFieldTouched((prev) => new Set(prev.add(field)));

      setLocalState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          ...(error && { error }),
          value,
        },
      }));
    },
    [localState],
  );

  const validateFieldTouched = async (event: any) => {
    const { eventType, field, fieldType, value } = getFieldDataFromEvent(event);

    if (eventType && field && fieldType) {
      switch (eventType) {
        case 'blur': {
          const canBlur = !(
            ['text'].includes(fieldType) &&
            ['address_country'].includes(field) &&
            localState[field]?.value
          );

          if (canBlur) {
            const shouldPersistData =
              !!fieldType &&
              ['text'].includes(fieldType) &&
              fieldsTouched.has(field) &&
              storedFields[field]?.value !== value;

            const changes = await fieldValidator(field, value, shouldPersistData);

            changes && updateLocalState(changes);
          }
          break;
        }

        case 'mousedown':
        case 'change': {
          if ('text' === fieldType) {
            setFieldTouched((prev) => new Set(prev.add(field)));

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
          } else {
            const shouldPersistData = ['checkbox', 'select-one'].includes(fieldType);
            const checkMultiSelectValue =
              fieldType === 'select-one' && Array.isArray(value) ? value[0] : value;

            const changes = await fieldValidator(field, checkMultiSelectValue, shouldPersistData);

            changes && updateLocalState(changes);
          }
          break;
        }
      }
    }
  };

  return {
    localState,
    validateFieldTouched,
  };
};
