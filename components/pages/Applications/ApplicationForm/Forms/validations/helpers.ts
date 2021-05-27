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
        console.log('default event handler, may malfunction', event);

        return {
          field: event.target.id,
          type: event.type,
          value: event.target.value,
        };
    }
  }

  // TODO: create dev mode
  console.log('unhandled event', event.target, event);
  return {};
};
