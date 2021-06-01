import { CountryNamesAndAbbreviations, FormFieldDataFromEvent } from '../types';
import yup from './schemas';

export const schemaValidator = (fieldSchema: any, value: any) =>
  fieldSchema.validate(value).catch((error: yup.ValidationError) => ({
    error: error?.errors?.length > 0 ? error.errors : error.message,
  }));

export const getFieldDataFromEvent: FormFieldDataFromEvent = (event) => {
  if (['INPUT', 'MULTISELECT', 'SELECT'].includes(event?.target?.tagName)) {
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

export const transformContriesToSelectOptions = (countriesList: CountryNamesAndAbbreviations[]) =>
  countriesList.map(({ name }: CountryNamesAndAbbreviations) => ({
    content: name,
    value: name,
  }));

export const transformToSelectOptions = (list: Array<string | number>) =>
  list.map((value: string | number) => ({
    content: value,
    value: value,
  }));

export const transformContriesToValidationOptions = (
  countriesList: CountryNamesAndAbbreviations[],
) => countriesList.map(({ name }: CountryNamesAndAbbreviations) => name);
