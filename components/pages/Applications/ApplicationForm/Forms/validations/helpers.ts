import { countBy } from 'lodash';
import { AnyObject } from 'yup/lib/types';

// locale-customised import
import yup from './schemas';
import {
  CountryNamesAndAbbreviations,
  EVENT_TARGET_TAGS,
  FormFieldDataFromEvent,
  FormFieldType,
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
      event?.target?.tagName as unknown as EVENT_TARGET_TAGS,
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
      console.info('unable to get value at getSeedValueByFieldType', fieldType);
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

    case 'string':
      return { [fieldName]: fieldNameInner ? { [fieldNameInner]: value.trim() } : value.trim() };

    default:
      console.info('unable to get value at getValueByFieldTypeToPublish', field, type);
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
        meta?.shape !== 'modal' ? value?.map(getValueByFieldTypeToValidate) : value;

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
      console.info('unable to get value at getValueByFieldTypeToValidate', field, type);
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
) => countriesList.map(({ name }: CountryNamesAndAbbreviations) => name);

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

export const checkMatchingPrimaryAffiliation = (
  value: string,
  applicantPrimaryAffiliation: string,
) =>
  value &&
  applicantPrimaryAffiliation &&
  value.trim() !== applicantPrimaryAffiliation && {
    error: [
      `Primary Affiliation must be the same as the Applicant: ${applicantPrimaryAffiliation}`,
    ],
  };
