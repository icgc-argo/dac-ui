import { Dispatch, useCallback, useEffect, useReducer, useState } from 'react';
import { isEqual, merge } from 'lodash';

import { API } from 'global/constants';
import { useAuthContext } from 'global/hooks';

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

export { getMin, isRequired } from './helpers';

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
                ...state.sections[action.section]?.fields?.[fieldName]?.value,
                ...action.value,
              })
                .map(([, item]: [any, any]) =>
                  errorValue.includes(item.value)
                    ? {
                        ...item,
                        error: item.error?.includes(error)
                          ? item.error
                          : [error, ...(item.error || [])],
                      }
                    : item,
                )
                .reduce(
                  (acc, item, index) => ({
                    ...acc,
                    [index]: item,
                  }),
                  {},
                )
            : {
                ...state.sections[action.section]?.fields?.[fieldName]?.value,
                ...action.value,
              }
          : action.value;

      return {
        ...state,
        sections: {
          ...state.sections,
          [action.section]: {
            ...state.sections[action.section],
            ...(action.overall &&
              state.sections[action.section]?.overall === FORM_STATES.PRISTINE && {
                overall: action.overall,
              }),
            fields: {
              ...state.sections[action.section]?.fields,
              [fieldName]: {
                ...state.sections[action.section]?.fields?.[fieldName],
                ...(action.type === 'object'
                  ? {
                      fields: {
                        ...state.sections[action.section]?.fields?.[fieldName]?.fields,
                        [fieldIndex]: {
                          ...state.sections[action.section]?.fields?.[fieldName]?.fields?.[
                            fieldIndex
                          ],
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
        },
      };
    }

    case 'overall': {
      return {
        ...state,
        sections: {
          ...state.sections,
          [action.section]: {
            ...state.sections[action.section],
            overall: action.overall,
          },
        },
      };
    }

    case 'remove': {
      return {
        ...state,
        sections: {
          ...state.sections,
          [action.section]: {
            ...state.sections[action.section],
            fields: {
              ...state.sections[action.section]?.fields,
              [action.field]: {
                ...state.sections[action.section]?.fields?.[action.field],
                value: {
                  ...state.sections[action.section]?.fields?.[action.field]?.value,
                  [action.value]: {
                    hidden: true,
                  },
                },
              },
            },
          },
        },
      };
    }

    case 'seeding': {
      console.log('seeding', state, action);

      const {
        createdAtUtc,
        lastUpdatedAtUtc,
        sections: {
          applicant: {
            info: { displayName, primaryAffiliation },
          },
        },
        state: status,
        __v,
      } = action.value;

      return {
        ...state,
        createdAtUtc,
        lastUpdatedAtUtc,
        status,
        __v,
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
        Object.entries(validationState.sections[origin]?.fields as object).reduce(
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
              validationState.sections[origin]?.overall || '',
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

      if (fieldOverride) {
        const results = {
          field: fieldName,
          section: origin,
          type: fieldOverride,
          value: fieldIndex,
        } as FormValidationAction;

        dispatch(results);

        return results;
      }

      const { error } = await schemaValidator(
        yup.reach(
          combinedSchema[origin],
          fieldIndex && fieldOverride !== 'overall' ? `${fieldName}[${fieldIndex}]` : fieldName,
        ),
        fieldOverride === 'overall'
          ? Object.values<FormFieldType>(validationState.sections[origin]?.fields[fieldName]?.value)
              .filter(({ hidden }) => !hidden)
              .map(({ value }) => value)
          : value,
      );

      const nextValue = { ...(error && { error }), value };

      const results = {
        field,
        ...(shouldPersistResults && { overall: FORM_STATES.TOUCHED }),
        section: origin,
        type: validationState.sections[origin]?.fields?.[fieldName]?.type,
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
  const { fetchWithAuth, isLoading } = useAuthContext();
  const [validationState, validationDispatch]: [FormValidationStateParameters, Dispatch<any>] =
    useReducer(validationReducer, {
      appId,
      sections: {
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
      },
      __v: 0,
    } as FormValidationStateParameters);

  useEffect(() => {
    fetchWithAuth({
      url: `${API.APPLICATIONS}/${appId}`,
    })
      .then(({ data }: { data: Record<string, any> }) =>
        validationDispatch({
          type: 'seeding',
          value: data,
        }),
      )
      .catch((error: Error) => {
        // TODO dev logging, errors should not be shown to user
        console.error(error);
      });
  }, []);

  const validateSection = validator(validationState, validationDispatch);

  return {
    isLoading,
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
