import * as yup from 'yup';
import { countriesList } from '../constants';
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
  address_building: yup.string().default(''),
  address_cityAndProvince: yup.string().default('').required(),
  address_country: yup
    .string()
    .default('')
    .oneOf(transformContriesToValidationOptions(countriesList))
    .required(),
  address_postalCode: yup.string().default('').required(),
  address_street: yup.string().default('').required(),
  info_firstName: yup.string().default('').required(),
  info_googleEmail: yup
    .string()
    .default('')
    .email('Please enter a valid email address.')
    .required(),
  info_institutionWebsite: yup.string().default('').url('Please enter a valid url.').required(),
  info_institutionEmail: yup
    .string()
    .default('')
    .email('Please enter a valid email address.')
    .required(),
  info_lastName: yup.string().default('').required(),
  info_middleName: yup.string().default(''),
  info_positionTitle: yup.string().default('').required(),
  info_primaryAffiliation: yup.string().default('').required(),
  info_suffix: yup.string().default(''),
  info_title: yup.string().default(''),
});

export const dataAccessAgreementsSchema = yup.object().shape({
  agreements: yup.object().shape({
    daa_correct_application_content: yup.boolean().default(false).oneOf([true]).required(),
    daa_agree_to_terms: yup.boolean().default(false).oneOf([true]).required(),
  }),
});

export const introductionSchema = yup.object().shape({
  agreement: yup.boolean().default(false).oneOf([true]).required(),
});

export const itAgreementsSchema = yup.object().shape({
  agreements: yup.object().shape({
    it_agreement_software_updates: yup.boolean().default(false).oneOf([true]).required(),
    it_agreement_protect_data: yup.boolean().default(false).oneOf([true]).required(),
    it_agreement_monitor_access: yup.boolean().default(false).oneOf([true]).required(),
    it_agreement_destroy_copies: yup.boolean().default(false).oneOf([true]).required(),
    it_agreement_onboard_training: yup.boolean().default(false).oneOf([true]).required(),
    it_agreement_provide_institutional_policies: yup
      .boolean()
      .default(false)
      .oneOf([true])
      .required(),
    it_agreement_contact_daco_fraud: yup.boolean().default(false).oneOf([true]).required(),
    it_agreement_cloud_usage_risk: yup.boolean().default(false).oneOf([true]).required(),
    it_agreement_read_cloud_appendix: yup.boolean().default(false).oneOf([true]).required(),
  }),
});

export const representativeSchema = yup.object().shape({
  address_building: yup.string().default(''),
  address_cityAndProvince: yup.string().default('').required(),
  address_country: yup
    .string()
    .default('')
    .oneOf(transformContriesToValidationOptions(countriesList))
    .required(),
  address_postalCode: yup.string().default('').required(),
  address_street: yup.string().default('').required(),
  info_firstName: yup.string().default('').required(),
  info_institutionEmail: yup
    .string()
    .default('')
    .email('Please enter a valid email address.')
    .required(),
  info_lastName: yup.string().default('').required(),
  info_middleName: yup.string().default(''),
  info_positionTitle: yup.string().default('').required(),
  info_primaryAffiliation: yup.string().default('').required(),
  info_suffix: yup.string().default(''),
  info_title: yup.string().default(''),
});

export const signatureSchema = yup.object().shape({});

export const combinedSchema = {
  applicant: applicantSchema,
  dataAccessAgreements: dataAccessAgreementsSchema,
  introduction: introductionSchema,
  itAgreements: itAgreementsSchema,
  representative: representativeSchema,
  signature: signatureSchema,
} as Record<FormSectionNames, any>;

export default yup;
