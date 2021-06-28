import * as yup from 'yup';
import { countriesList } from '../constants';
import { FormSectionNames } from '../types';
import { transformContriesToValidationOptions, maxWords, uniquePublicationURLs } from './helpers';

export const requiredMsg = 'Please fill out the required field.';
export const textareaLimit = 200;

yup.setLocale({
  mixed: {
    required: requiredMsg,
    oneOf: requiredMsg,
  },
  string: {
    email: 'Please enter a valid email address.',
    url: 'Please enter a valid url. Must begin with http:// or https://, for example, https://platform.icgc-argo.org/.',
    min: '${label} must be at least ${min} characters.',
  },
  number: {
    lessThan: '${label} must be less than ${less}',
    moreThan: '${label} must be greater than ${more}',
    min: '${label} may be at least ${min}',
    max: '${label} may be at most ${max}',
  },
});

export const appendicesSchema = yup.object().shape({
  agreements: yup.object().shape({
    appendix_icgc_goals_policies: yup.boolean().default(false).oneOf([true]).required(),
    appendix_large_scale_data_sharing: yup.boolean().default(false).oneOf([true]).required(),
    appendix_prepublication_policy: yup.boolean().default(false).oneOf([true]).required(),
    appendix_publication_policy: yup.boolean().default(false).oneOf([true]).required(),
    appendix_nih_genomic_inventions: yup.boolean().default(false).oneOf([true]).required(),
    appendix_oecd_genetic_inventions: yup.boolean().default(false).oneOf([true]).required(),
    appendix_cloud_security: yup.boolean().default(false).oneOf([true]).required(),
    appendix_ga4gh_framework: yup.boolean().default(false).oneOf([true]).required(),
  }),
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
  info_institutionWebsite: yup
    .string()
    .default('')
    .url(
      'Please enter a valid url. Must begin with http:// or https://, for example, https://platform.icgc-argo.org/.',
    )
    .required(),
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

export const dataAccessAgreementSchema = yup.object().shape({
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
  }),
});

export const projectInfoSchema = yup.object().shape({
  aims: yup.string().default('').test(maxWords(200)).required(),
  background: yup.string().default('').test(maxWords(200)).required(),
  methodology: yup.string().default('').test(maxWords(200)).required(),
  publicationsURLs: yup
    .array(
      yup
        .string()
        .default('')
        .url(
          'Please enter a valid url. Must begin with http:// or https://, for example, https://platform.icgc-argo.org/.',
        )
        .required(),
    )
    .test(uniquePublicationURLs)
    .min(3),
  summary: yup.string().default('').test(maxWords(200)).required(),
  title: yup.string().default('').required(),
  website: yup
    .string()
    .default('')
    .url(
      'Please enter a valid url. Must begin with http:// or https://, for example, https://platform.icgc-argo.org/.',
    ),
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
  addressSameAsApplicant: yup.boolean().default(false),
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
  appendices: appendicesSchema,
  applicant: applicantSchema,
  dataAccessAgreement: dataAccessAgreementSchema,
  ITAgreements: itAgreementsSchema,
  projectInfo: projectInfoSchema,
  representative: representativeSchema,
  signature: signatureSchema,
  terms: introductionSchema,
} as Record<FormSectionNames, any>;

export default yup;
