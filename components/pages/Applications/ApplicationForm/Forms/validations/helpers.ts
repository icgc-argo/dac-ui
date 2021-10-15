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

import { countBy, isEqual } from 'lodash';
import { AnyObject } from 'yup/lib/types';

// locale-customised import
import yup from './schemas';
import { applicantFieldNames } from '../constants';
import {
  CountryNamesAndAbbreviations,
  EVENT_TARGET_TAGS,
  FormFieldDataFromEvent,
  FormFieldType,
  FormSectionNames,
  FormSectionValidationState_Applicant,
  FormValidationAction,
  FormValidationStateParameters,
} from '../types';

// the one same letter, in norwegian AND in swedish: i.e. highly unlikely used together
export const LINE_JUMP_PLACEHOLDER = ' øö ';

export const countWordsInString = (value: string) => {
  // // use a placeholder for line breaks, so we can respect white space on display
  const wordArray = value.replace(/\r\n|\r|\n/g, LINE_JUMP_PLACEHOLDER).split(/\s/g);
  // discount the following exceptions as non-words:
  const empties = wordArray.filter(
    (x: any) =>
      !x || // empty spaces
      x === LINE_JUMP_PLACEHOLDER.trim() || // line breaks (placeholder)
      !x.match(/[a-zA-Z0-9]+/g), // chains of symbols without letters/numbers
  ).length;

  return wordArray.length - empties;
};

export const getFieldDataFromEvent: FormFieldDataFromEvent = (event) => {
  if (
    Object.values(EVENT_TARGET_TAGS).includes(
      (event?.target?.tagName as unknown) as EVENT_TARGET_TAGS,
    )
  ) {
    switch (event?.target?.type) {
      case 'checkbox':
        return {
          eventType: event.type,
          field: event.target.defaultValue,
          fieldType: event.target.type,
          value: event.target.checked,
        };

      case 'radio': // this many need refactoring after improving UiKit Radio components
      case 'select-one':
      case 'text':
        return {
          eventType: event.type,
          field: event.target.id.replace('-multiselect', ''),
          fieldType: event.target.type,
          value: event.target.value,
        };

      default:
        return {
          eventType: event?.type,
          field: event?.target?.id,
          fieldType: event?.target?.type,
          value: event?.target?.value,
        };
    }
  }

  return {};
};

export const getInternalFieldSchema = (fieldParent?: FormFieldType) =>
  fieldParent?.innerType?.fields || {};

export const getMin = (fieldData?: FormFieldType) =>
  (fieldData?.tests?.find((test) => test.name === 'min')?.params?.min as number) || 0;

export const isRequired = (fieldData?: FormFieldType) =>
  fieldData?.tests?.some((test) => test.name === 'required') || false;

export const maxWords = (max: number) => ({
  message: 'Please enter ${max} words or less.',
  name: `max${max}Words`,
  params: {
    max,
  },
  test: (value: string) => countWordsInString(value) <= max,
});

export const minWords = (min: number) => ({
  message: 'Please enter at least ${min} words.',
  name: `min${min}Words`,
  params: {
    min,
  },
  test: (value: string) => countWordsInString(value) >= min,
});

export const schemaValidator = (fieldSchema: any, value: any) =>
  fieldSchema.validate(value).catch((error: yup.ValidationError) => ({
    error: error?.errors?.length > 0 ? error.errors : error.message,
  }));

const getSeedValueByFieldType = (fieldType: string, fieldBase: any, seedValue: any) => {
  switch (fieldType) {
    case 'array': {
      const isPublicationURLsArray = fieldBase.meta?.shape === 'publicationURLsArray';
      // Ensure starting with an array that satisfies a minimum number of fields,
      // as they'll be PATCHed together, in order to avoid order bugs
      const valueFiller = fieldBase.innerType?.type === 'string' ? '' : null;
      const baseArray = Array.from({ length: getMin(fieldBase) }, () => ({ value: valueFiller }));

      return {
        value: isPublicationURLsArray
          ? seedValue.reduce(
              (acc: Record<number, any>, value: unknown, index: number) => ({
                ...acc,
                [index]: {
                  value: value ?? valueFiller,
                },
              }),
              baseArray,
            )
          : seedValue,
      };
    }

    case 'boolean': {
      return {
        value: seedValue && (typeof seedValue === 'boolean' ? seedValue : seedValue.accepted),
      };
    }

    case 'string':
      return { value: seedValue };

    default:
      break;
  }
};

export const getValueByFieldTypeToPublish = (
  { field = '', type, value }: Partial<FormValidationAction>,
  fieldMeta?: FormFieldType['meta'],
  fieldValue?: any,
): any => {
  const [fieldNameSource, fieldIndex] = field.split('--');
  const [fieldName, fieldNameInner] = fieldNameSource.split('_');

  switch (type) {
    case 'array':
      return {
        [fieldName]: Object.entries({
          ...fieldValue,
          ...value,
        })
          .filter((urlObj) => (urlObj[1] as FormFieldType).value !== null)
          .map((urlObj) => (urlObj[1] as FormFieldType).value),
      };

    case 'boolean': {
      if (fieldMeta) {
        if (fieldMeta.shape === 'collection') {
          return {
            accepted: value,
            name: fieldNameSource,
          };
        } else if (fieldMeta.shape === 'singleAcceptance') {
          return {
            [fieldNameSource]: { accepted: value },
          };
        }
      }

      return {
        [fieldNameSource]: value,
      };
    }

    case 'object': {
      if (fieldMeta) {
        if (fieldMeta.shape === 'collection') {
          return {
            [fieldName]: [
              getValueByFieldTypeToPublish(
                {
                  field: fieldIndex,
                  type: fieldMeta.type,
                  value,
                },
                fieldMeta,
              ),
            ],
          };
        }
      }

      return null;
    }

    case 'string': {
      return { [fieldName]: fieldNameInner ? { [fieldNameInner]: value } : value };
    }

    default:
      break;
  }
};

export const getValueByFieldTypeToValidate = (
  { fields, meta, type, value }: FormFieldType,
  field?: string,
): any => {
  if (meta?.skipValidation || value === undefined) return null;

  switch (type) {
    case 'array': {
      const fieldValues =
        meta?.shape === 'modal'
          ? value
          : (meta?.shape === 'publicationURLsArray' ? Object.values(value) : value)?.map(
              getValueByFieldTypeToValidate,
            );

      return fieldValues?.filter((item: any) => item).length > 0 ? fieldValues : null;
    }

    case 'boolean': {
      return typeof value === 'boolean' ? value : null;
    }

    case 'object': {
      const fieldValues = Object.entries(fields).reduce((acc, [innerName, innerData]) => {
        const innerValue = getValueByFieldTypeToValidate(
          innerData as FormFieldType,
          innerName || 'innerField',
        );

        return {
          ...acc,
          ...(innerValue !== null && {
            [innerName]: innerValue,
          }),
        };
      }, {});

      return Object.keys(fieldValues).length === 0 ? null : fieldValues;
    }

    case 'string':
      return value?.length > 0 ? value : null;

    default:
      break;
  }
};

export const sectionFieldsSeeder = (
  validationData: any,
  seedData: any,
  nested?: boolean,
): FormValidationStateParameters => {
  if (validationData && seedData) {
    const seededValidationData = Object.keys(validationData).reduce((seeded, fieldName) => {
      const fieldBase = validationData[fieldName];
      const fieldType = fieldBase?.type;
      const names = nested ? fieldName : fieldName.split('_');

      const seedValue = nested
        ? seedData.find((datum: any) => datum.name === fieldName)
        : names.length > 1
        ? seedData[names[0]]?.[names[1]]
        : seedData[names[0]];

      return {
        ...seeded,
        [fieldName]: {
          ...fieldBase,
          ...(fieldType === 'object'
            ? { fields: sectionFieldsSeeder(fieldBase.fields, seedValue, !!'nested') }
            : getSeedValueByFieldType(fieldType, fieldBase, seedValue)),
        },
      };
    }, {} as FormValidationStateParameters);

    return seededValidationData;
  }

  return validationData;
};

export const transformContriesToSelectOptions = (countriesList: CountryNamesAndAbbreviations[]) =>
  countriesList.map(({ name }: CountryNamesAndAbbreviations) => ({
    content: name,
    value: name,
  }));

export const transformContriesToValidationOptions = (
  countriesList: CountryNamesAndAbbreviations[],
) => countriesList.map(({ name }: CountryNamesAndAbbreviations) => name).concat('');

export const transformToSelectOptions = (list: Array<string | number>) => [
  { content: '-- Select an option --', value: ' ' },
  ...list.map((value: string | number) => ({
    content: value,
    value: value,
  })),
];

export const uniquePublicationURLs = {
  name: `uniquePublicationURLs`,
  test: (value: string[] | undefined, { createError }: yup.TestContext<AnyObject>) => {
    const valid = new Set(value).size === value?.length;
    if (valid) return valid;
    return createError({
      message: 'Publication URLs must be unique.|${path}',
      ...(value && {
        path: Object.entries(countBy(value))
          .filter(([, count]) => (count as number) > 1)
          .map(([url]) => url)
          .join('--'),
      }),
    });
  },
};

export const checkMatchingApplicant = (
  origin: FormSectionNames,
  field: string,
  value: string,
  applicantData: FormSectionValidationState_Applicant,
) => {
  if (value) {
    switch (true) {
      case field.includes(applicantFieldNames.AFFILIATION): {
        const applicantValue = applicantData[applicantFieldNames.AFFILIATION]?.value;

        return (
          applicantValue &&
          value.trim() !== applicantValue && {
            error: [`Primary Affiliation must be the same as the Applicant: ${applicantValue}`],
          }
        );
      }

      case field.includes(applicantFieldNames.EMAIL):
      case field.includes(applicantFieldNames.GMAIL): {
        if (['collaborators'].includes(origin)) {
          const applicantEmail = applicantData[applicantFieldNames.EMAIL]?.value;
          const applicantGmail = applicantData[applicantFieldNames.GMAIL]?.value;

          return (
            (applicantEmail || applicantGmail) &&
            [applicantEmail, applicantGmail].includes(value.trim()) && {
              error: ['The applicant does not need to be added as a collaborator'],
            }
          );
        }
      }

      default: {
        return false;
      }
    }
  }
};

// The applicant does not need to be added as a collaborator

export const sectionsWithAutoComplete = ['applicant', 'collaborators', 'representative'];
export const fieldsWithAutoComplete = [
  'address_cityAndProvince',
  'address_postalCode',
  'address_streetAddress',
  'info_firstName',
  'info_googleEmail',
  'info_institutionEmail',
  'info_lastName',
  'info_middleName',
];

export const getFieldValues = (fieldsObj: any, isList: boolean): { [key: string]: any } => {
  // format data from state into an object where old and new values can be compared,
  // and field names are formatted properly for the validator & API
  const fields = isList ? fieldsObj.list?.innerType?.fields : fieldsObj;
  return Object.keys(fields)
    .filter((field: string) => fieldsWithAutoComplete.includes(field))
    .reduce(
      (acc: any, curr: string) => ({
        ...acc,
        [`${isList ? 'list--' : ''}${curr}`]: fields[curr],
      }),
      {},
    );
};

export const getUpdatedFields = (oldFields: any, newFields: any): string[] =>
  Object.keys(oldFields).filter(
    (fieldName: string) => !isEqual(oldFields[fieldName].value, newFields[fieldName].value),
  );
