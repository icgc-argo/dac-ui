import { useReducer } from 'react';
import { find } from 'lodash';

import {
  RequestRevisionsFieldNames,
  RequestRevisionsFieldsState,
  RequestRevisionsFieldTitles,
  RequestRevisionsState,
} from './types';

export const MINIMUM_DETAILS_LENGTH = 10;
export const SECONDARY_FIELDS: RequestRevisionsFieldNames[] = ['general'];

const initialFieldState = {
  details: '',
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

const requestRevisionsReducer = (state: RequestRevisionsState, action: any) => {
  // TODO revisit action type in data hookup ticket
  const { fieldName }: { fieldName: RequestRevisionsFieldNames } = action;
  const nextState = {
    ...state,
    fields: {
      ...state.fields,
      [action.fieldName]: {
        ...state.fields[fieldName],
        requested: action.type === 'requested'
          ? !state.fields[fieldName].requested
          : state.fields[fieldName].requested,
        details: action.type === 'details'
          ? action.payload
          : action.type === 'requested'
            ? ''
            : state.fields[fieldName].details
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
}

export default useRequestRevisionsReducer;
