import * as yup from 'yup';
import { countriesList, honorificsList } from '../constants';
import { FormSectionNames } from '../types';
import { transformContriesToValidationOptions } from './helpers';

export const requiredMsg = 'Please fill out the required field.';

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

export const applicantSchema = yup.object().shape({
  info_firstName: yup.string().default('').required(),
  info_googleEmail: yup
    .string()
    .matches(
      /^[a-z0-9](\.?[a-z0-9]){3,}@g(oogle)?mail\.com$/,
      'Please enter a valid Google email address.',
    )
    .default('')
    .required(),
  info_institutionWebsite: yup.string().url('Please enter a valid url.').default('').required(),
  info_institutionEmail: yup
    .string()
    .email('Please enter a valid email address.')
    .default('')
    .required(),
  info_lastName: yup.string().default('').required(),
  info_middleName: yup.string().default(''),
  info_positionTitle: yup.string().default('').required(),
  info_primaryAffiliation: yup.string().default('').required(),
  info_suffix: yup.string().default(''),
  info_title: yup.string().default(''),
  address_building: yup.string().default(''),
  address_cityAndProvince: yup
    .string()
    .matches(/([^,]+),([^,]+)/, requiredMsg)
    .default('')
    .required(),
  address_country: yup
    .string()
    .oneOf(transformContriesToValidationOptions(countriesList))
    .default('')
    .required(),
  address_street: yup.string().default('').required(),
  address_postalCode: yup.string().default('').required(),
});

export const introductionSchema = yup.object().shape({
  agreement_accepted: yup.boolean().default(false).oneOf([true]).required(),
});

export const signatureSchema = yup.object().shape({});

export const combinedSchema = {
  applicant: applicantSchema,
  introduction: introductionSchema,
  signature: signatureSchema,
} as Record<FormSectionNames, any>;

export default yup;
