/*
 * Copyright (c) 2021 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { Dispatch, useCallback, useEffect, useReducer, useState } from 'react';
import { find, isEqual, isNull, omit } from 'lodash';
import merge from 'deepmerge';

import { AuthAPIFetchFunction } from 'components/pages/Applications/types';
import { API } from 'global/constants';
import { useAuthContext } from 'global/hooks';

import { applicantFieldNames, sectionsOrder, sectionStatusMapping } from '../constants';
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
  checkMatchingApplicant,
  schemaValidator,
  sectionFieldsSeeder,
  getValueByFieldTypeToValidate,
  getFieldValues,
  getUpdatedFields,
  sectionsWithAutoComplete,
  fieldsWithAutoComplete,
  valueIsEmpty,
} from './helpers';
import yup, { combinedSchema } from './schemas';
import { AxiosResponse } from 'axios';

export { getMin, isRequired } from './helpers';

export const TERMS_PLACEHOLDER_FORM_DATA = {
  meta: { status: SECTION_STATUS.PRISTINE, overall: SECTION_STATUS.PRISTINE },
  fields: {},
};

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
          const seedData =
            sectionName === 'terms' ? TERMS_PLACEHOLDER_FORM_DATA : sections[sectionName] || {};
          const overall = sectionStatusMapping[seedData?.meta?.status as SECTION_STATUS];
          const showOverall = !formState.__seeded &&
            overall !== FORM_STATES.PRISTINE && {
              showOverall: true,
            };
          const validationData =
            formState.sections[sectionName] ||
            (sectionName === 'terms' ||
              console.error(`Seeding for "${sectionName}" hasn't been implemented yet`),
            {});

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

export const validator: FormSectionValidatorFunction_Main = (formState, dispatch, apiFetcher) => (
  origin,
  reasonToValidate,
) => async (fieldsToValidate: any = []) => {
  const validatingApplicant = origin === 'applicant';
  const applicantData = formState.sections.applicant.fields;

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
              checkMatchingApplicant(origin, field, data.value, applicantData)),
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
  } else if (fieldsToValidate.length > 0) {
    const fieldsWithModalOverride = fieldsToValidate.filter(
      ({ field = '' }) => field && field.split('--')[2]?.includes('Modal'),
    );

    for (const { field = '', value = '' } of fieldsWithModalOverride) {
      const fieldName = field.split('--')[0];
      const fieldOverride = field.split('--')[2];
      const error =
        value &&
        Object.keys(formState.sections[origin].fields[fieldName].innerType?.fields).reduce(
          (acc, innerField) => {
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
                checkMatchingApplicant(origin, innerField, innerValue, applicantData);

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
    }

    const fieldsWithoutModalOverride = fieldsToValidate.filter(
      ({ field = '' }) => field && !field.split('--')[2]?.includes('Modal'),
    );

    if (fieldsWithoutModalOverride.length > 0) {
      const fieldNames = fieldsWithoutModalOverride.map((fieldObj: any) => fieldObj.field);

      if (
        validatingApplicant &&
        ((fieldNames.includes(applicantFieldNames.AFFILIATION) &&
          find(fieldsWithoutModalOverride, { field: applicantFieldNames.AFFILIATION })?.value !==
            applicantData[applicantFieldNames.AFFILIATION]) ||
          (fieldNames.includes(applicantFieldNames.EMAIL) &&
            find(fieldsWithoutModalOverride, { field: applicantFieldNames.EMAIL })?.value !==
              applicantData[applicantFieldNames.EMAIL]) ||
          (fieldNames.includes(applicantFieldNames.GMAIL) &&
            find(fieldsWithoutModalOverride, { field: applicantFieldNames.GMAIL })?.value !==
              applicantData[applicantFieldNames.GMAIL]))
      ) {
        dispatch({
          field: 'validated',
          section: 'representative',
          type: 'sectionOverall',
          value: false,
        });
      }

      const fieldsWithErrors = await Promise.all(
        fieldsWithoutModalOverride.map(async (fieldItem: any) => {
          const { field, value } = fieldItem;
          const [fieldName, fieldIndex, fieldOverride] = field.split('--');
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
          return {
            ...fieldItem,
            error,
          };
        }),
      );

      const fieldsResults = fieldsWithErrors.map((fieldObj: any) => {
        const [fieldName, fieldIndex] = fieldObj.field.split('--');
        const fieldIsArray = !Number.isNaN(Number(fieldIndex));

        const nextValue = {
          ...(fieldObj.error
            ? { error: fieldObj.error }
            : !validatingApplicant &&
              checkMatchingApplicant(origin, fieldObj.field, fieldObj.value, applicantData)),
          value: fieldObj.value,
        };

        const results = {
          field: fieldObj.field,
          section: origin,
          type: formState.sections[origin]?.fields?.[fieldName]?.type,
          ...(fieldIsArray
            ? {
                error: fieldObj.error,
                value: {
                  [fieldIndex]: nextValue,
                },
              }
            : nextValue),
        } as FormValidationAction;

        fieldObj.shouldPersistResults && dispatch(results);

        const isModalShape =
          formState.sections[origin]?.fields?.[fieldName]?.meta?.shape === 'modal';

        return {
          fieldName,
          results,
          // shouldPersistResults:true is necessary to get the required field error to persist after other fields are focused/blurred/changed
          // valueStayedEmpty is used to ensure that fields that remain empty after being touched do not trigger a PATCH request
          shouldPatch: fieldObj.shouldPersistResults && !fieldObj.valueStayedEmpty && !isModalShape,
        };
      });

      const fieldsForPatch = fieldsResults.filter((fieldObj: any) => fieldObj.shouldPatch);
      const valuesForPatch = fieldsForPatch.map((fieldObj: any) =>
        getValueByFieldTypeToPublish(
          fieldObj.results,
          formState.sections[origin]?.fields?.[fieldObj.fieldName]?.meta,
          formState.sections[origin]?.fields?.[fieldObj.fieldName]?.value,
        ),
      );

      const sectionForPatch = valuesForPatch.reduce((acc, curr) => {
        // reduce/flatten valuesForPatch array for API
        // i.e. put all address changes in one `address: {}` object
        const [key, value] = Object.entries(curr)[0];
        return {
          ...acc,
          [key]:
            Array.isArray(value) || typeof value !== 'object'
              ? value
              : {
                  ...(acc[key] || {}),
                  ...(value as object),
                },
        };
      }, {});

      if (Object.keys(sectionForPatch).length > 0) {
        await apiFetcher({
          method: 'PATCH',
          data: {
            sections: { [origin]: sectionForPatch },
            // __v: formState.__v,
          },
        })
          .then(({ data, ...response } = {} as AxiosResponse<any>) => {
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
          })
          .catch((err) => console.error(err));
      }

      return fieldsResults.map((fieldObj) => fieldObj.results as FormValidationAction);
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
    [appId],
  );

  const [formState, validationDispatch]: [
    FormValidationStateParameters,
    Dispatch<any>,
  ] = useReducer(validationReducer, {
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
    (changes: FormValidationAction[] = []) => {
      const newState = changes.reduce((acc, curr: FormValidationAction) => {
        const { error, field = '', value, type } = curr;
        const validatingPrimaryAffiliation = field.includes('info_primaryAffiliation');
        const [fieldName, fieldIndex, fieldOverride] = field.split('--');

        const currentSection = acc[sectionName];
        const currentSectionFields = acc[sectionName]?.fields;
        const currentField = currentSectionFields[fieldName];
        const oldValue = currentField?.value || '';

        return {
          ...acc,
          [sectionName]: {
            ...currentSection,
            fields: {
              ...currentSectionFields,
              [fieldName]:
                type === 'remove'
                  ? storedFields[fieldName]
                  : {
                      ...currentField,
                      ...((type === 'array' && currentField.innerType?.type === 'object') ||
                      currentField?.meta?.shape === 'modal'
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
        };
      }, localState as FormValidationState_AllSectionsObj);

      setLocalState(newState);
      return newState;
    },
    [localState],
  );

  const validateFieldTouched: FormFieldValidationTriggerFunction = async (event) => {
    const { eventType, field, fieldType, value } = getFieldDataFromEvent(event);

    if (eventType && field && fieldType) {
      const [fieldName, fieldIndex] = field.split('--');
      const isList = sectionName === 'collaborators';

      switch (eventType) {
        // **NOTE** Firefox and Chrome handle autofill events differently, see note in Frontend wiki
        case 'blur': {
          if (
            sectionsWithAutoComplete.includes(sectionName) &&
            fieldsWithAutoComplete.includes(isList ? fieldIndex : fieldName)
          ) {
            const oldValues = getFieldValues(storedFields, isList);
            const newValues = getFieldValues(localState[sectionName].fields, isList);
            // get ALL fields that have changed since last GET
            // if updatedFields.length > 1, autocomplete happened
            const updatedFields = getUpdatedFields(oldValues, newValues, field);

            const fieldsForValidator = updatedFields.map((updatedField: any) => {
              const [updatedFieldName, updatedFieldIndex] = updatedField.split('--');
              const fieldObj = isList
                ? localState[sectionName].fields.list?.innerType?.fields[updatedFieldIndex]
                : localState[sectionName].fields[updatedFieldName];

              const valueStayedEmpty =
                valueIsEmpty(oldValues[updatedFieldName]?.value) &&
                valueIsEmpty(newValues[updatedFieldName]?.value);

              return {
                field: updatedField,
                shouldPersistResults: fieldObj.type === 'string',
                value: fieldObj.type === 'string' ? (fieldObj.value || '').trim() : fieldObj.value,
                valueStayedEmpty,
              };
            });

            const changes = await fieldValidator(fieldsForValidator);
            changes && updateLocalState(changes);
          } else {
            const oldValue = storedFields[fieldName]?.value;
            const oldValueSubField = fieldIndex && oldValue?.[fieldIndex];

            const valueIsText = ['select-one', 'text', 'textarea'].includes(fieldType);

            const previousValueToCompare = oldValueSubField
              ? oldValueSubField.hasOwnProperty('value')
                ? oldValueSubField.value
                : oldValueSubField
              : oldValue;

            const valueStayedEmpty = valueIsEmpty(value) && valueIsEmpty(previousValueToCompare);
            // if there is an oldValueSubField (i.e. publication urls), don't do value stays empty check
            // for some reason this causes the required field error to flash on then off when tabbing through pub fields
            // shouldPersistResults needs to be false for the required field error to persist while modifying other pub url fields
            const shouldPersistResults =
              !!fieldType && valueIsText && oldValueSubField
                ? value !== previousValueToCompare
                : value !== oldValue || valueStayedEmpty;

            const changes = await fieldValidator([
              {
                field,
                value: valueIsText ? (value || '').trim() : value,
                shouldPersistResults,
                valueStayedEmpty,
              },
            ]);

            changes && updateLocalState(changes);
          }
          break;
        }

        case 'change':
        case 'mousedown': {
          if ('text' === fieldType) {
            updateLocalState([
              {
                field,
                value: fieldIndex
                  ? {
                      [fieldIndex]: { value },
                    }
                  : value,
              },
            ] as FormValidationAction[]);
          } else if ('remove' === fieldType) {
            const changes = await fieldValidator([
              {
                field,
                value: null,
                shouldPersistResults: !!'remove',
              },
            ]);

            changes && updateLocalState(changes);
          } else if (fieldType.includes('Modal')) {
            fieldValidator([{ field, value }]);
          } else if (fieldType === 'select-one' && eventType === 'change') {
            // this is the equivalent of a blur/save event for this field.
            const changes = await fieldValidator([
              { field, value: value[0], shouldPersistResults: true },
            ]);

            changes && updateLocalState(changes);
          } else if (fieldType !== 'select-one') {
            const shouldPersistResults = ['checkbox', 'radio'].includes(fieldType);

            const changes = await fieldValidator([{ field, value, shouldPersistResults }]);

            changes && updateLocalState(changes);
          }
          break;
        }

        case 'focus':
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
