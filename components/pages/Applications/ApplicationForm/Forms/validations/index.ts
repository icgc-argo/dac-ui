import { Dispatch, useCallback, useEffect, useReducer, useState } from 'react';
import { isEqual, merge } from 'lodash';

import { getFieldDataFromEvent, schemaValidator } from './helpers';
import yup, { combinedSchema } from './schemas';
import {
  FormFieldType,
  FormSectionValidationState_Sections,
  FormFieldValidatorFunction,
  FormSectionValidatorFunction_Main,
  FormValidationAction,
  FormValidationStateParameters,
  FORM_STATES,
} from '../types';

export { isRequired } from './helpers';

export const validationReducer = (
  state: FormValidationStateParameters,
  action: FormValidationAction,
): FormValidationStateParameters => {
  switch (action.type) {
    case 'array':
    case 'boolean':
    case 'object':
    case 'string': {
      const [error, ...errorValue] = action.error?.[0]?.split('|') || [];
      const [fieldName, fieldIndex] = action.field.split('--');

      const value =
        action.type === 'array'
          ? errorValue
            ? Object.entries({
                ...state[action.section]?.fields?.[fieldName]?.value,
                ...action.value,
              }).map(([, item]: [any, any]) =>
                errorValue.includes(item.value)
                  ? {
                      ...item,
                      error: item.error?.includes(error)
                        ? item.error
                        : [error, ...(item.error || [])],
                    }
                  : item,
              )
            : {
                ...state[action.section]?.fields?.[fieldName]?.value,
                ...action.value,
              }
          : action.value;

      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          ...(action.overall &&
            state[action.section]?.overall === FORM_STATES.PRISTINE && {
              overall: action.overall,
            }),
          fields: {
            ...state[action.section]?.fields,
            [fieldName]: {
              ...state[action.section]?.fields?.[fieldName],
              ...(action.type === 'object'
                ? {
                    fields: {
                      ...state[action.section]?.fields?.[fieldName]?.fields,
                      [fieldIndex]: {
                        ...state[action.section]?.fields?.[fieldName]?.fields?.[fieldIndex],
                        error: action.error || undefined,
                        value,
                      },
                    },
                  }
                : {
                    error: action.error || undefined,
                    value,
                  }),
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
      console.info('unhandled action type', action.type);
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
          ? FORM_STATES.INCOMPLETE
          : !['', FORM_STATES.DISABLED, FORM_STATES.PRISTINE].includes(
              validationState[origin]?.overall || '',
            )
          ? FORM_STATES.COMPLETE
          : undefined,
        ...(error && { error }),
      } as FormValidationAction;
      dispatch(results);

      return results;
    } else if (field) {
      const [fieldName, fieldIndex, fieldOverride] = field.split('--');
      const fieldIsArray = !Number.isNaN(Number(fieldIndex));

      const { error } = await schemaValidator(
        yup.reach(
          combinedSchema[origin],
          fieldIndex && fieldOverride !== 'overall' ? `${fieldName}[${fieldIndex}]` : fieldName,
        ),
        fieldOverride === 'overall'
          ? Object.values<FormFieldType>(validationState[origin]?.fields[fieldName]?.value).map(
              ({ value }) => value,
            )
          : value,
      );

      const nextValue = { ...(error && { error }), value };

      const results = {
        field,
        ...(shouldPersistResults && { overall: FORM_STATES.TOUCHED }),
        section: origin,
        type: validationState[origin]?.fields?.[fieldName]?.type,
        ...(fieldIsArray
          ? {
              error,
              value: {
                [fieldIndex]: nextValue,
              },
            }
          : nextValue),
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
          overall: FORM_STATES.PRISTINE,
        },
      }),
      {},
    ),
    signature: {
      ...combinedSchema.signature.describe(),
      overall: FORM_STATES.DISABLED,
    },
    version: 0,
  } as FormValidationStateParameters);

  const validateSection = validator(validationState, validationDispatch);

  return {
    validationState,
    validateSection,
  };
};

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
    if (!isEqual(storedFields, localState)) {
      setLocalState((prev) => merge(prev, storedFields));
    }
  }, [storedFields]);

  const updateLocalState = useCallback(
    ({ error, field, value, type }: FormValidationAction) => {
      fieldsTouched.has(field) || setFieldTouched((prev) => new Set(prev.add(field)));
      const [fieldName, fieldIndex, fieldOverride] = field.split('--');

      const oldValue = localState[fieldName]?.value;

      const newState = {
        ...localState,
        [fieldName]: {
          ...localState[fieldName],
          ...(type === 'object'
            ? {
                fields: {
                  ...localState[fieldName].fields,
                  [fieldIndex]: {
                    ...localState[fieldName].fields[fieldIndex],
                    error,
                    value,
                  },
                },
              }
            : {
                error,
                value:
                  typeof oldValue === 'object'
                    ? {
                        ...oldValue,
                        ...([fieldOverride, type].includes('remove')
                          ? {
                              [fieldIndex]: {
                                hidden: true,
                              },
                            }
                          : value),
                      }
                    : value,
              }),
        },
      } as FormSectionValidationState_Sections;

      setLocalState(newState);
      return newState;
    },
    [localState],
  );

  const validateFieldTouched = async (event: any) => {
    const { eventType, field, fieldType, value } = getFieldDataFromEvent(event);

    if (eventType && field && fieldType) {
      const [fieldName, fieldIndex] = field.split('--');

      switch (eventType) {
        case 'blur': {
          const canBlur = !(
            ['text'].includes(fieldType) &&
            ['address_country'].includes(fieldName) &&
            localState[fieldName]?.value
          );

          if (canBlur) {
            const shouldPersistData =
              !!fieldType &&
              ['text'].includes(fieldType) &&
              fieldsTouched.has(field) &&
              value !==
                (fieldIndex
                  ? storedFields[fieldName]?.value?.[fieldIndex]
                  : storedFields[fieldName]?.value);

            const changes = await fieldValidator(field, value, shouldPersistData);

            changes && updateLocalState(changes);
          }
          break;
        }

        case 'change':
        case 'mousedown': {
          if ('text' === fieldType) {
            setFieldTouched((prev) => new Set(prev.add(field)));

            updateLocalState({
              field,
              value: fieldIndex
                ? {
                    [fieldIndex]: { value },
                  }
                : value,
            } as FormValidationAction);
          } else if ('remove' === fieldType) {
            fieldIndex &&
              setFieldTouched((prev) => {
                prev.delete(field.replace('--remove', ''));
                return new Set(prev);
              });

            const changes = await fieldValidator(field);

            changes && updateLocalState(changes);
          } else {
            const shouldPersistData = ['checkbox', 'select-one'].includes(fieldType);
            const checkMultiSelectValue =
              fieldType === 'select-one' && Array.isArray(value) ? value[0] : value;

            const changes = await fieldValidator(field, checkMultiSelectValue, shouldPersistData);

            changes && updateLocalState(changes);
          }
          break;
        }

        default: {
          console.info('unhandled Field event', event);
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
