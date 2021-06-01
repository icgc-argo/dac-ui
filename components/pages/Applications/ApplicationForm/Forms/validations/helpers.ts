import { ChangeEvent } from 'react';

export const handleFieldTypes = (event: ChangeEvent<HTMLInputElement>) => {
  if (['INPUT'].includes(event?.target?.tagName)) {
    switch (event?.target?.type) {
      case 'checkbox':
        return {
          field: event.target.defaultValue,
          type: event.type,
          value: event.target.checked,
        };

      default:
        return {
          field: event.target.id,
          type: event.type,
          value: event.target.value,
        };
    }
  }

  return {};
};
