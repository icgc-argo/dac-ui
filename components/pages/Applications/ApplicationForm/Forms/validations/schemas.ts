import * as yup from 'yup';
import { FormSectionNames } from '../types';

const requiredMsg = 'Please fill out the required field.';

yup.setLocale({
  mixed: {
    required: requiredMsg,
    oneOf: requiredMsg,
  },
  string: {
    email: 'Please enter a valid email address.',
    url: 'Please enter a valid url.',
    min: '${label} must be at least ${min} characters.',
  },
  number: {
    lessThan: '${label} must be less than ${less}',
    moreThan: '${label} must be greater than ${more}',
    min: '${label} may be at least ${min}',
    max: '${label} may be at most ${max}',
  },
});

export const introductionSchema = yup.object().shape({
  // test: yup.boolean().default(false).oneOf([true]).required(),
  agreement_accepted: yup.boolean().default(false).oneOf([true]).required(),
});

export const signatureSchema = yup.object().shape({});

export const combinedSchema = {
  introduction: introductionSchema,
  signature: signatureSchema,
} as Record<FormSectionNames, any>;

export default yup;
