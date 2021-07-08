import { Dispatch, useCallback, useEffect, useReducer, useState } from 'react';
import { isEqual, merge, omit } from 'lodash';

import { API } from 'global/constants';
import { useAuthContext } from 'global/hooks';

import { sectionsOrder, sectionStatusMapping } from '../constants';
import {
  FormFieldType,
  FormSectionValidationState_Sections,
  FormFieldValidationTriggerFunction,
  FormFieldValidatorFunction,
  FormSectionValidatorFunction_Main,
  FormValidationAction,
  FormValidationStateParameters,
  FORM_STATES,
  FormSectionNames,
  FormSectionValidationState_SectionBase,
  SECTION_STATUS,
} from '../types';
import { getFieldDataFromEvent, schemaValidator, sectionFieldsSeeder } from './helpers';
import yup, { combinedSchema } from './schemas';

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
        action.type === 'array'
          ? errorValue
            ? Object.entries({
                ...formState.sections[action.section]?.fields?.[fieldName]?.value,
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
            ...(action.overall &&
              formState.sections[action.section]?.overall === FORM_STATES.PRISTINE && {
                overall: action.overall,
              }),
            fields: {
              ...formState.sections[action.section]?.fields,
              [fieldName]: {
                ...formState.sections[action.section]?.fields?.[fieldName],
                ...(action.type === 'object'
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

    case 'overall': {
      return {
        ...formState,
        sections: {
          ...formState.sections,
          [action.section]: {
            ...formState.sections[action.section],
            overall: action.overall,
          },
        },
      };
    }

    case 'remove': {
      return {
        ...formState,
        sections: {
          ...formState.sections,
          [action.section]: {
            ...formState.sections[action.section],
            fields: {
              ...formState.sections[action.section]?.fields,
              [action.field]: {
                ...formState.sections[action.section]?.fields?.[action.field],
                value: {
                  ...formState.sections[action.section]?.fields?.[action.field]?.value,
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
      const {
        createdAtUtc,
        lastUpdatedAtUtc,
        revisionRequest,
        sections,
        state,
        __v,
      } = action.value;

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
                  meta: seedData?.meta,
                  overall:
                    state === 'APPROVED' && ['collaborators'].includes(sectionName)
                      ? FORM_STATES.CAN_EDIT
                      : sectionStatusMapping[seedData?.meta?.status as SECTION_STATUS],
                },
              }
            : seededSectionsData;
        }, {} as Record<FormSectionNames, FormSectionValidationState_SectionBase>),
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

export const validator: FormSectionValidatorFunction_Main = (formState, dispatch) => (
  origin,
  validateSection,
) => async (field, value, shouldPersistResults) => {
  if (validateSection) {
    const { error } = await schemaValidator(
      combinedSchema[origin],
      Object.entries(formState.sections[origin]?.fields as object).reduce(
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
            formState.sections[origin]?.overall || '',
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
        ? Object.values<FormFieldType>(formState.sections[origin]?.fields[fieldName]?.value)
            .filter(({ hidden }) => !hidden)
            .map(({ value }) => value)
        : value,
    );

    const nextValue = { ...(error && { error }), value };

    const results = {
      field,
      ...(shouldPersistResults && { overall: FORM_STATES.TOUCHED }),
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

    shouldPersistResults && dispatch(results);

    return results;
  }
};

export const useFormValidation = (appId: string) => {
  const { fetchWithAuth, isLoading } = useAuthContext();
  const [formState, validationDispatch]: [
    FormValidationStateParameters,
    Dispatch<any>,
  ] = useReducer(validationReducer, {
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
    },
    __seeded: false,
    __v: 0,
  } as FormValidationStateParameters);

  useEffect(() => {
    fetchWithAuth({
      url: `${API.APPLICATIONS}/${appId}`,
    })
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
      });
  }, [appId]);

  const validateSection = validator(formState, validationDispatch);

  return {
    isLoading,
    formState,
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

  const validateFieldTouched: FormFieldValidationTriggerFunction = async (event) => {
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
