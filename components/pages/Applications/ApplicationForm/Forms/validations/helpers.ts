import yup from './schemas';
import { CountryNamesAndAbbreviations, EVENT_TARGET_TAGS, FormFieldDataFromEvent } from '../types';

export const schemaValidator = (fieldSchema: any, value: any) =>
  fieldSchema.validate(value).catch((error: yup.ValidationError) => ({
    error: error?.errors?.length > 0 ? error.errors : error.message,
  }));

export const getFieldDataFromEvent: FormFieldDataFromEvent = (event) => {
  if (
    [EVENT_TARGET_TAGS.INPUT, EVENT_TARGET_TAGS.MULTISELECT, EVENT_TARGET_TAGS.SELECT].includes(
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
