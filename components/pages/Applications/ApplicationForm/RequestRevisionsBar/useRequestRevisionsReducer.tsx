import { useReducer } from 'react';
import { find } from 'lodash';

import {
  RequestRevisionProperties,
  RequestRevisionsFieldNames,
  RequestRevisionsFieldsState,
  RequestRevisionsFieldTitles,
  RequestRevisionsState,
} from './types';

export const MINIMUM_DETAILS_LENGTH = 10;
export const SECONDARY_FIELDS: RequestRevisionsFieldNames[] = ['general'];

const ERROR_TEXT = `Message must be at least ${MINIMUM_DETAILS_LENGTH} characters.`;

const initialFieldState: RequestRevisionProperties = {
  details: '',
  error: '',
  requested: false,
};

const initialStateFields = Object.keys(RequestRevisionsFieldTitles).reduce((acc, curr) => ({
  ...acc,
  [curr]: initialFieldState
}), {}) as RequestRevisionsFieldsState;

const initialState: RequestRevisionsState = {
  isSecondaryFieldsEnabled: false,
  isSendEnabled: false,
  fields: { ...initialStateFields }
};

const getOnlyPrimaryFieldsState = (fields: any) => Object.keys(RequestRevisionsFieldTitles)
  .filter(title => !SECONDARY_FIELDS.includes(title as RequestRevisionsFieldNames))
  .reduce((acc, curr) => ({
    ...acc,
    [curr]: { ...fields[curr as RequestRevisionsFieldNames] },
  }), {}) as RequestRevisionsFieldsState;

const findCompleteFields = (fields: any) => find(
  Object.values(fields), (field: any) => field.requested &&
    field.details &&
    field.details.length >= MINIMUM_DETAILS_LENGTH
);

const findPartiallyCompleteFields = (fields: any) => find(
  Object.values(fields), (item: any) => item.requested &&
    (!item.details || item.details.length < MINIMUM_DETAILS_LENGTH)
);

const checkSendEnabled = (fields: any) => !!findCompleteFields(fields) &&
  !findPartiallyCompleteFields(fields);

const makeFieldState = (fieldState: RequestRevisionProperties, action: any) => {
  switch (action.type) {
    case 'detailsBlur': {
      return ({
        error: action.payload.length < MINIMUM_DETAILS_LENGTH
          ? ERROR_TEXT
          : fieldState.error
      });
    }
    case 'detailsChange': {
      return ({
        details: action.payload,
        error: action.payload.length >= MINIMUM_DETAILS_LENGTH
          ? initialFieldState.error
          : fieldState.error
      });
    }
    case 'detailsClick': {
      return ({
        requested: true,
      });
    }
    case 'requestedClick': {
      return ({
        details: initialFieldState.details,
        error: initialFieldState.error,
        requested: !fieldState.requested,
      });
    }
    default: {
      return fieldState;
    }
  }
};

const requestRevisionsReducer = (state: RequestRevisionsState, action: any) => {
  // TODO revisit action type in data hookup ticket
  const { fieldName }: { fieldName: RequestRevisionsFieldNames } = action;
  const newFieldState = makeFieldState(state.fields[fieldName], action);

  const nextState = {
    ...state,
    fields: {
      ...state.fields,
      [action.fieldName]: {
        ...state.fields[fieldName],
        ...newFieldState,
      }
    }
  };

  const primaryFields = getOnlyPrimaryFieldsState(nextState.fields);
  const isSecondaryFieldsEnabled: boolean = !!findCompleteFields(primaryFields);

  return {
    ...nextState,
    fields: {
      ...nextState.fields,
      ...isSecondaryFieldsEnabled
        ? {}
        : SECONDARY_FIELDS.reduce((acc, curr) => ({
          ...acc,
          [curr]: initialFieldState
        }), {})
    },
    isSecondaryFieldsEnabled,
    isSendEnabled: checkSendEnabled(nextState.fields),
  }
};

const useRequestRevisionsReducer = () => {
  const [state, dispatch] = useReducer(requestRevisionsReducer, initialState);
  return { state, dispatch };
};

export default useRequestRevisionsReducer;
