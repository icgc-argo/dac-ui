import { Dispatch, useCallback, useEffect, useReducer, useState } from 'react';
import { isEqual, isNull, omit } from 'lodash';
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
  checkMatchingPrimaryAffiliation,
  schemaValidator,
  sectionFieldsSeeder,
  getValueByFieldTypeToValidate,
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
                ...(formState.sections[action.section]?.fields?.[fieldName]?.meta?.shape ===
                  'modal' && fieldIndex
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
                    const error = action.error?.[innerField[0]];

                    return {
                      ...acc,
                      [innerField[0]]:
                        action.type === 'clearModal'
                          ? omit(innerField[1] as FormFieldType, ['error', 'value'])
                          : {
                              ...(innerField[1] as FormFieldType),
                              ...error,
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

    case 'sectionOverall': {
      return {
        ...formState,
        sections: {
          ...formState.sections,
          [action.section]: {
            ...formState.sections[action.section],
            meta: {
              ...formState.sections[action.section].meta,
              [action.field]: action.value,
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
          const overall = sectionStatusMapping[seedData?.meta?.status as SECTION_STATUS];
          const showOverall = !formState.__seeded &&
            overall !== FORM_STATES.PRISTINE && {
              showOverall: true,
            };
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
                    ...showOverall,
                    overall,
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
  (origin, reasonToValidate) =>
  async (field, value, shouldPersistResults) => {
    const applicantPrimaryAffiliation =
      formState.sections.applicant.fields.info_primaryAffiliation.value;
    const validatingApplicant = origin === 'applicant';

    if (reasonToValidate) {
      dispatch({
        field: 'validated',
        section: origin,
        type: 'sectionOverall',
        value: true,
      });

      Object.entries(formState.sections[origin]?.fields as object).map(async ([field, data]) => {
        const fieldValue = getValueByFieldTypeToValidate(data, field || origin);

        if (!isNull(fieldValue)) {
          if (reasonToValidate === 'notShowingOverall') return fieldValue;

          const validatingPrimaryAffiliation = field.includes('info_primaryAffiliation');
          const [fieldName, fieldIndex, fieldOverride] = field.split('--');

          const { error } = await schemaValidator(
            yup.reach(
              combinedSchema[origin],
              fieldIndex && fieldOverride !== 'overall' ? `${fieldName}.${fieldIndex}` : fieldName,
            ),
            data.meta?.shape === 'modal'
              ? fieldValue.map((modalItem: any) =>
                  Object.entries(data.innerType?.fields).reduce((acc, innerField) => {
                    const [fieldNamePrefix, fieldNameSuffix] = innerField[0].split('_');

                    return {
                      ...acc,
                      [innerField[0]]: fieldNameSuffix
                        ? modalItem[fieldNamePrefix][fieldNameSuffix]
                        : modalItem[innerField[0]],
                    };
                  }, {}),
                )
              : fieldValue,
          );

          const results = {
            field,
            section: origin,
            type: data.type,
            value: data.value,
            ...(error
              ? { error }
              : !validatingApplicant &&
                validatingPrimaryAffiliation &&
                checkMatchingPrimaryAffiliation(data.value, applicantPrimaryAffiliation)),
          } as FormValidationAction;

          dispatch(results);
        }
      });

      reasonToValidate === 'notShowingOverall' &&
        dispatch({
          field: 'showOverall',
          section: origin,
          type: 'sectionOverall',
          value: true,
        });
    } else if (field) {
      const [fieldName, fieldIndex, fieldOverride] = field.split('--');
      const fieldIsArray = !Number.isNaN(Number(fieldIndex));

      if (fieldOverride?.includes('Modal')) {
        const error =
          value &&
          Object.keys(formState.sections[origin].fields[fieldName].innerType?.fields).reduce(
            (acc, innerField) => {
              const validatingPrimaryAffiliation = innerField.includes('primaryAffiliation');
              const [fieldNamePrefix, fieldNameSuffix] = innerField.split('_');
              const innerValue = fieldNameSuffix
                ? value[fieldNamePrefix][fieldNameSuffix]
                : value[innerField];

              const { error } = schemaValidator(
                yup.reach(combinedSchema[origin], `${fieldName}.${innerField}`),
                innerValue,
              );

              const validationResult = error
                ? { error }
                : !validatingApplicant &&
                  validatingPrimaryAffiliation &&
                  checkMatchingPrimaryAffiliation(innerValue, applicantPrimaryAffiliation);

              return {
                ...acc,
                ...(validationResult && { [innerField]: validationResult }),
              };
            },
            {},
          );

        dispatch({
          field: fieldName,
          section: origin,
          type: fieldOverride as FormValidationActionTypes,
          value,
          error,
        });
      } else {
        const validatingPrimaryAffiliation = field.includes('info_primaryAffiliation');

        if (
          validatingApplicant &&
          validatingPrimaryAffiliation &&
          applicantPrimaryAffiliation !== value
        ) {
          dispatch({
            field: 'validated',
            section: 'representative',
            type: 'sectionOverall',
            value: false,
          });
        }

        const { error } = fieldOverride
          ? { error: null } // TODO: this validation will be handled in ticket #138
          : await schemaValidator(
              yup.reach(
                combinedSchema[origin],
                fieldIndex && fieldOverride !== 'overall'
                  ? `${fieldName}.${fieldIndex}`
                  : fieldName,
              ),
              value,
            );

        const nextValue = {
          ...(error
            ? { error }
            : !validatingApplicant &&
              validatingPrimaryAffiliation &&
              checkMatchingPrimaryAffiliation(value, applicantPrimaryAffiliation)),
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
                ? (!['', SECTION_STATUS.INCOMPLETE, SECTION_STATUS.PRISTINE].includes(
                    data.sections[origin].meta.status || '',
                  ) &&
                    dispatch({
                      field: 'showOverall',
                      section: origin,
                      type: 'sectionOverall',
                      value: true,
                    }),
                  dispatch({
                    type: 'updating',
                    value: data,
                  }))
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
                showOverall: false,
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
      const validatingPrimaryAffiliation = field.includes('info_primaryAffiliation');
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
                                // ensure affiliation validation is applied before allowing "save"
                                error: validatingPrimaryAffiliation ? error || [''] : error,
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
          const shouldPersistData =
            !!fieldType &&
            ['select-one', 'text', 'textarea'].includes(fieldType) &&
            fieldsTouched.has(field) &&
            value !==
              (fieldIndex
                ? storedFields[fieldName]?.value?.[fieldIndex]
                : storedFields[fieldName]?.value);

          const valueIsText = ['select-one', 'text'].includes(fieldType);

          const changes = await fieldValidator(
            field,
            valueIsText ? (value || '').trim() : value,
            shouldPersistData,
          );

          changes && updateLocalState(changes);
          break;
        }

        case 'change': {
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

        case 'keydown': {
          // do nothing, triggered by 'select-one' (e.g. country);
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
