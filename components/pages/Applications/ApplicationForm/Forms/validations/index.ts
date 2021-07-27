import { Dispatch, useCallback, useEffect, useReducer, useState } from 'react';
import { isEqual, omit } from 'lodash';
import merge from 'deepmerge';

import { AuthAPIFetchFunction } from 'components/pages/Applications/types';
import { API } from 'global/constants';
import { useAuthContext } from 'global/hooks';

import { sectionsOrder, sectionStatusMapping } from '../constants';
import {
  FormFieldType,
  FormSectionNames,
  FormSectionValidationState_Sections,
  FormFieldValidationTriggerFunction,
  FormFieldValidatorFunction,
  FormSectionValidatorFunction_Main,
  FormValidationAction,
  FormValidationStateParameters,
  FormValidationState_AllSectionsObj,
  FORM_STATES,
  SECTION_STATUS,
  FormValidationActionTypes,
} from '../types';
import {
  getFieldDataFromEvent,
  getValueByFieldTypeToPublish,
  schemaValidator,
  sectionFieldsSeeder,
} from './helpers';
import yup, { combinedSchema } from './schemas';
import { AxiosResponse } from 'axios';

export { getMin, isRequired } from './helpers';

export const validationReducer = (
  formState: FormValidationStateParameters,
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
        action.type === 'array' &&
        formState.sections[action.section]?.fields?.[fieldName]?.meta?.shape !== 'modal'
          ? errorValue
            ? Object.entries({
                ...formState.sections[action.section]?.fields?.[fieldName]?.value,
                ...action.value,
              })
                .filter(([, item]: [any, any]) => item.value !== null)
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
                ...formState.sections[action.section]?.fields?.[fieldName]?.value,
                ...action.value,
              }
          : action.value;

      return {
        ...formState,
        sections: {
          ...formState.sections,
          [action.section]: {
            ...formState.sections[action.section],
            fields: {
              ...formState.sections[action.section]?.fields,
              [fieldName]: {
                ...formState.sections[action.section]?.fields?.[fieldName],
                ...(formState.sections[action.section]?.fields?.[fieldName]?.meta?.shape === 'modal'
                  ? {
                      innerType: {
                        ...formState.sections[action.section]?.fields?.[fieldName].innerType,
                        fields: {
                          ...formState.sections[action.section]?.fields?.[fieldName].innerType
                            ?.fields,
                          [fieldIndex]: {
                            ...formState.sections[action.section]?.fields?.[fieldName].innerType
                              ?.fields[fieldIndex],
                            error: action.error || undefined,
                            value,
                          },
                        },
                      },
                    }
                  : action.type === 'object'
                  ? {
                      fields: {
                        ...formState.sections[action.section]?.fields?.[fieldName]?.fields,
                        [fieldIndex]: {
                          ...formState.sections[action.section]?.fields?.[fieldName]?.fields?.[
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

    case 'clearModal':
    case 'feedModal': {
      return {
        ...formState,
        sections: {
          ...formState.sections,
          [action.section]: {
            ...formState.sections[action.section],
            fields: {
              ...formState.sections[action.section].fields,
              [action.field]: {
                ...formState.sections[action.section].fields[action.field],
                innerType: {
                  ...formState.sections[action.section].fields[action.field].innerType,
                  fields: Object.entries(
                    formState.sections[action.section].fields[action.field].innerType?.fields,
                  ).reduce((acc, innerField) => {
                    const [fieldNamePrefix, fieldNameSuffix] = innerField[0].split('_');

                    return {
                      ...acc,
                      [innerField[0]]:
                        action.type === 'clearModal'
                          ? omit(innerField[1] as FormFieldType, ['error', 'value'])
                          : {
                              ...(innerField[1] as FormFieldType),
                              value: fieldNameSuffix
                                ? action.value[fieldNamePrefix][fieldNameSuffix]
                                : action.value[innerField[0]],
                            },
                    };
                  }, {}),
                },
              },
            },
          },
        },
      };
    }

    case 'overall': {
      return {
        ...formState,
        sections: {
          ...formState.sections,
          [action.section]: {
            ...formState.sections[action.section],
            meta: {
              ...formState.sections[action.section].meta,
              validated: true,
            },
          },
        },
      };
    }

    case 'updating':
    case 'seeding': {
      const { createdAtUtc, lastUpdatedAtUtc, revisionRequest, sections, state, __v } =
        action.value;

      return {
        ...formState,
        createdAtUtc,
        lastUpdatedAtUtc,
        revisionRequest,
        sections: sectionsOrder.reduce((seededSectionsData, sectionName) => {
          const seedData = sections[sectionName] || {};
          const validationData =
            formState.sections[sectionName] ||
            (console.error(`Seeding for "${sectionName}" hasn't been implemented yet`), {});

          return Object.keys(seedData).length
            ? {
                ...seededSectionsData,
                [sectionName]: {
                  ...validationData,
                  fields: sectionFieldsSeeder(validationData.fields, omit(seedData, 'meta')),
                  meta: {
                    ...validationData.meta,
                    ...seedData.meta,
                    overall: sectionStatusMapping[seedData?.meta?.status as SECTION_STATUS],
                  },
                },
              }
            : seededSectionsData;
        }, {} as FormValidationState_AllSectionsObj),
        state,
        __seeded: true,
        __v,
      };
    }

    default:
      console.info('unhandled action type', action.type);
      return formState;
  }
};

export const validator: FormSectionValidatorFunction_Main =
  (formState, dispatch, apiFetcher) =>
  (origin, validateSection) =>
  async (field, value, shouldPersistResults) => {
    if (validateSection) {
      const sectionErrorsListFromBackEnd = formState.sections[origin].meta.errorsList || [];
      if (sectionErrorsListFromBackEnd.length > 0) {
        // WIP: marks the section as validated, so this is only done only once after seeding.
        dispatch({
          section: origin,
          type: 'overall',
        });

        Object.entries(formState.sections[origin]?.fields as object).forEach(
          async ([field, data]) => {
            if (data.value) {
              const [fieldName, fieldIndex, fieldOverride] = field.split('--');

              const { error } = await schemaValidator(
                yup.reach(
                  combinedSchema[origin],
                  fieldIndex && fieldOverride !== 'overall'
                    ? `${fieldName}.${fieldIndex}`
                    : fieldName,
                ),
                data.value,
              );

              const results = {
                field,
                section: origin,
                type: data.type,
                value: data.value,
                ...(error && { error }),
              } as FormValidationAction;

              dispatch(results);
            }
          },
        );
        // });
      }
      // return results;
    } else if (field) {
      const [fieldName, fieldIndex, fieldOverride] = field.split('--');
      const fieldIsArray = !Number.isNaN(Number(fieldIndex));

      if (fieldOverride?.includes('Modal')) {
        dispatch({
          field: fieldName,
          section: origin,
          type: fieldOverride as FormValidationActionTypes,
          value,
        });
      } else {
        const { error } = fieldOverride
          ? { error: null } // TODO: this validation will be handled in ticket #138
          : await schemaValidator(
              yup.reach(
                combinedSchema[origin],
                fieldIndex && fieldOverride !== 'overall'
                  ? `${fieldName}.${fieldIndex}`
                  : fieldName,
              ),
              fieldOverride === 'overall'
                ? Object.values<FormFieldType>(formState.sections[origin]?.fields[fieldName]?.value)
                    .filter(({ value }) => value !== null)
                    .map(({ value }) => value)
                : value,
            );

        const nextValue = {
          ...(error && { error }),
          value,
        };

        const results = {
          field,
          section: origin,
          type: formState.sections[origin]?.fields?.[fieldName]?.type,
          ...(fieldIsArray
            ? {
                error,
                value: {
                  [fieldIndex]: nextValue,
                },
              }
            : nextValue),
        } as FormValidationAction;

        if (shouldPersistResults) {
          dispatch(results);

          if (formState.sections[origin]?.fields?.[fieldName]?.meta?.shape !== 'modal') {
            const stateAfter = await apiFetcher({
              method: 'PATCH',
              data: {
                sections: {
                  [origin]: getValueByFieldTypeToPublish(
                    results,
                    formState.sections[origin]?.fields?.[fieldName]?.meta,
                    formState.sections[origin]?.fields?.[fieldName]?.value,
                  ),
                },
                // __v: formState.__v,
              },
            }).then(({ data, ...response } = {} as AxiosResponse<any>) => {
              data
                ? dispatch({
                    type: 'updating',
                    value: data,
                  })
                : console.error(
                    'Something went wrong updating the application form',
                    response || 'no data in response',
                  );

              return data;
            });
          }
        }

        return results;
      }
    }
  };

export const useFormValidation = (appId: string) => {
  const [triggerFetch, setTriggerFetch] = useState(true);
  const { fetchWithAuth, isLoading } = useAuthContext();
  const apiFetcher: AuthAPIFetchFunction = useCallback(
    ({ data, method } = {}) =>
      fetchWithAuth({
        data,
        method,
        url: `${API.APPLICATIONS}/${appId}`,
      }),
    [],
  );

  const [formState, validationDispatch]: [FormValidationStateParameters, Dispatch<any>] =
    useReducer(validationReducer, {
      appId,
      sections: {
        ...Object.entries(combinedSchema).reduce(
          (acc, [section, schema]) => ({
            ...acc,
            [section]: {
              ...(schema?.describe?.() || schema),
              meta: {
                overall: FORM_STATES.PRISTINE,
              },
            },
          }),
          {},
        ),
      },
      __refetchAllData: (action?: FormValidationAction) => {
        action ? validationDispatch(action) : setTriggerFetch(true);
      },
      __seeded: false,
      __v: 0,
    } as FormValidationStateParameters);

  const validateSection = validator(formState, validationDispatch, apiFetcher);

  useEffect(() => {
    triggerFetch &&
      apiFetcher()
        .then(({ data, ...response }: { data?: Record<string, any> } = {}) =>
          data
            ? validationDispatch({
                type: 'seeding',
                value: data,
              })
            : console.error('Something went wrong seeding the application form', response),
        )
        .catch((error: Error) => {
          // TODO dev logging, errors should not be shown to user
          console.error(error);
        })
        .finally(() => setTriggerFetch(false));
  }, [appId, triggerFetch]);

  return {
    isLoading,
    formState,
    validateSection,
  };
};

export const useLocalValidation = (
  sectionName: FormSectionNames,
  storedFields: FormSectionValidationState_Sections,
  fieldValidator: FormFieldValidatorFunction,
) => {
  const [localState, setLocalState] = useState({
    [sectionName]: {
      fields: storedFields,
    },
  } as FormValidationState_AllSectionsObj);
  const [fieldsTouched, setFieldTouched] = useState(
    new Set<string>(
      Object.entries(storedFields).reduce(
        (acc: string[], [field, data]) => (data?.value ? [...acc, field] : acc),
        [],
      ),
    ),
  );
  const currentFields = localState[sectionName]?.fields || {};

  useEffect(() => {
    if (Object.keys(currentFields).length === 0 || !isEqual(storedFields, localState)) {
      setLocalState((prev) => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          fields: merge(currentFields, storedFields, {
            customMerge: (key) => {
              if (key !== 'error') {
                return (oldValue, newValue) => newValue;
              }
            },
          }),
        },
      }));
    }
  }, [storedFields]);

  const updateLocalState = useCallback(
    ({ error, field, value, type }: FormValidationAction) => {
      const [fieldName, fieldIndex, fieldOverride] = field.split('--');
      const currentSectionData = localState[sectionName];
      const currentSectionFields = currentSectionData?.fields;
      const currentField = currentSectionFields[fieldName];
      const oldValue = currentField.value;

      fieldOverride === 'remove' ||
        fieldsTouched.has(field) ||
        setFieldTouched((prev) => new Set(prev.add(field)));

      const newState = {
        ...localState,
        [sectionName]: {
          ...currentSectionData,
          fields: {
            ...currentSectionFields,
            [fieldName]:
              type === 'remove'
                ? storedFields[fieldName]
                : {
                    ...currentField,
                    ...((type === 'array' && currentField.innerType?.type === 'object') ||
                    currentField.meta?.shape === 'modal'
                      ? {
                          innerType: {
                            ...currentField.innerType,
                            fields: {
                              ...currentField.innerType?.fields,
                              [fieldIndex]: {
                                ...currentField.innerType?.fields[fieldIndex],
                                ...(value[fieldIndex] || { value }),
                                error,
                              },
                            },
                          },
                        }
                      : type === 'object'
                      ? {
                          fields: {
                            ...currentField.fields,
                            [fieldIndex]: {
                              ...currentField.fields[fieldIndex],
                              error,
                              value,
                            },
                          },
                        }
                      : {
                          error,
                          value:
                            oldValue && typeof oldValue === 'object'
                              ? {
                                  ...oldValue,
                                  ...([fieldOverride, type].includes('remove')
                                    ? {
                                        [fieldIndex]: {
                                          value: null,
                                        },
                                      }
                                    : value),
                                }
                              : value,
                        }),
                  },
          },
        },
      } as FormValidationState_AllSectionsObj;

      setLocalState(newState);
      return newState;
    },
    [localState],
  );

  const validateFieldTouched: FormFieldValidationTriggerFunction = async (event) => {
    const { eventType, field, fieldType, value } = getFieldDataFromEvent(event);

    if (eventType && field && fieldType) {
      const [fieldName, fieldIndex] = field.split('--');

      switch (eventType) {
        case 'blur': {
          const canBlur = !(
            ['text'].includes(fieldType) &&
            ['address_country'].includes(fieldName) &&
            localState[sectionName]?.fields[fieldName]?.value
          );

          if (canBlur) {
            const shouldPersistData =
              !!fieldType &&
              ['select-one', 'text', 'textarea'].includes(fieldType) &&
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

            const changes = await fieldValidator(field, null, !!'remove');

            changes && updateLocalState(changes);
          } else if (fieldType.includes('Modal')) {
            fieldValidator(field, value);
          } else {
            const shouldPersistData = ['checkbox', 'radio', 'select-one'].includes(fieldType);
            const checkMultiSelectValue =
              fieldType === 'select-one' && Array.isArray(value) ? value[0] : value;

            const changes = await fieldValidator(field, checkMultiSelectValue, shouldPersistData);

            changes && updateLocalState(changes);
          }
          break;
        }

        case 'focus': {
          ['select-one'].includes(fieldType) && setFieldTouched((prev) => new Set(prev.add(field)));
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
    localState: currentFields,
    validateFieldTouched,
  };
};
