import { countBy } from 'lodash';
import { AnyObject } from 'yup/lib/types';

// locale-customised import
import yup from './schemas';
import {
  CountryNamesAndAbbreviations,
  EVENT_TARGET_TAGS,
  FormFieldDataFromEvent,
  FormFieldType,
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

export const sectionFieldsSeeder = (validationData: any, seedData: any) => {
  if (validationData) {
    Object.keys(validationData).map((fieldName) => {
      console.log('fieldName', fieldName);
      const names = fieldName.split('_');
      if (names.length > 1) {
        console.log('split', names[0], names[1]);
      } else {
        console.log('not split', names[0]);
      }
    });
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

export const transformToSelectOptions = (list: Array<string | number>) =>
  list.map((value: string | number) => ({
    content: value,
    value: value,
  }));

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
