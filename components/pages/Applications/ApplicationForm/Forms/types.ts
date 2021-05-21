import { sectionsOrder } from "./constants";

export type FormSectionNames = typeof sectionsOrder[number];

export type ValidationActionType =
  | {
      type: 'clear all' | 'is ready' | 'not ready';
  };
    
export type ValidationParametersType = Partial<Record<FormSectionNames, any>>;
