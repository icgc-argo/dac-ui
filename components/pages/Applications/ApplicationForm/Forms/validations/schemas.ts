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
    url:
      'Please enter a valid url. Must begin with http:// or https://, for example, https://platform.icgc-argo.org/.',
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
  agreements: yup
    .object()
    .meta({ shape: 'collection', type: 'boolean' })
    .shape({
      appendix_icgc_goals_policies: yup.boolean().default(false).oneOf([true]).required(),
      appendix_data_access_policy: yup.boolean().default(false).oneOf([true]).required(),
      appendix_ip_policy: yup.boolean().default(false).oneOf([true]).required(),
    }),
});

export const applicantSchema = yup.object().shape({
  address_building: yup.string().default(''),
  address_cityAndProvince: yup.string().default('').trim().required(),
  address_country: yup
    .string()
    .default('')
    .trim()
    .oneOf(transformContriesToValidationOptions(countriesList))
    .required(),
  address_postalCode: yup.string().default('').trim().required(),
  address_streetAddress: yup.string().default('').trim().required(),
  info_firstName: yup.string().default('').trim().required(),
  info_googleEmail: yup
    .string()
    .default('')
    .trim()
    .email('Please enter a valid email address.')
    .required(),
  info_institutionEmail: yup
    .string()
    .default('')
    .trim()
    .email('Please enter a valid email address.')
    .required(),
  info_lastName: yup.string().default('').trim().required(),
  info_middleName: yup.string().default(''),
  info_positionTitle: yup.string().default('').trim().required(),
  info_primaryAffiliation: yup.string().default('').trim().required(),
  info_suffix: yup.string().default(''),
  info_title: yup.string().default(''),
  info_website: yup
    .string()
    .default('')
    .trim()
    .url(
      'Please enter a valid url. Must begin with http:// or https://, for example, https://platform.icgc-argo.org/.',
    )
    .required(),
});

export const collaboratorSchema = yup.object().shape({
  list: yup
    .array(
      yup.object().shape({
        id: yup.string().default(''),
        info_firstName: yup.string().default('').trim().required(),
        info_googleEmail: yup
          .string()
          .default('')
          .trim()
          .email('Please enter a valid email address.')
          .required(),
        info_institutionEmail: yup
          .string()
          .default('')
          .trim()
          .email('Please enter a valid email address.')
          .required(),
        info_lastName: yup.string().default('').trim().required(),
        info_middleName: yup.string().default(''),
        info_positionTitle: yup.string().default('').trim().required(),
        info_primaryAffiliation: yup.string().default('').trim().required(),
        info_suffix: yup.string().default(''),
        info_title: yup.string().default(''),
        type: yup.string().oneOf(['personnel', 'student']).required(),
      }),
    )
    .meta({ shape: 'modal', type: 'object' }),
});

export const dataAccessAgreementSchema = yup.object().shape({
  agreements: yup
    .object()
    .meta({ shape: 'collection', type: 'boolean' })
    .shape({
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
      daa_correct_application_content: yup.boolean().default(false).oneOf([true]).required(),
      daa_agree_to_terms: yup.boolean().default(false).oneOf([true]).required(),
    }),
});

export const ethicsLetterSchema = yup.object().shape({
  declaredAsRequired: yup.boolean().required(),
  approvalLetterDocs: yup
    .array(
      yup.object().shape({
        name: yup.string(),
        objectId: yup.string(),
        uploadedAtUtc: yup.string(),
      }),
    )
    .when('declaredAsRequired', {
      is: true, // alternatively: (val) => val == true
      then: yup.array().min(1),
      otherwise: yup.array().max(0),
    })
    .required(),
});

export const projectInfoSchema = yup.object().shape({
  aims: yup.string().default('').trim().test(maxWords(200)).required(),
  background: yup.string().default('').trim().test(maxWords(200)).required(),
  methodology: yup.string().default('').trim().test(maxWords(200)).required(),
  publicationsURLs: yup
    .array(
      yup
        .string()
        .default('')
        .trim()
        .url(
          'Please enter a valid url. Must begin with http:// or https://, for example, https://platform.icgc-argo.org/.',
        )
        .required(),
    )
    .meta({ shape: 'publicationURLsArray', filler: '', type: 'string' })
    .test(uniquePublicationURLs)
    .min(3),
  summary: yup.string().default('').trim().test(maxWords(200)).required(),
  title: yup.string().default('').trim().required(),
  website: yup
    .string()
    .default('')
    .trim()
    .url(
      'Please enter a valid url. Must begin with http:// or https://, for example, https://platform.icgc-argo.org/.',
    ),
});

export const representativeSchema = yup.object().shape({
  address_building: yup.string().default(''),
  address_cityAndProvince: yup.string().default('').trim().required(),
  address_country: yup
    .string()
    .default('')
    .trim()
    .oneOf(transformContriesToValidationOptions(countriesList))
    .required(),
  address_postalCode: yup.string().default('').trim().required(),
  address_streetAddress: yup.string().default('').trim().required(),
  addressSameAsApplicant: yup.boolean().default(false),
  info_firstName: yup.string().default('').trim().required(),
  info_institutionEmail: yup
    .string()
    .default('')
    .trim()
    .email('Please enter a valid email address.')
    .required(),
  info_lastName: yup.string().default('').trim().required(),
  info_middleName: yup.string().default(''),
  info_positionTitle: yup.string().default('').trim().required(),
  info_primaryAffiliation: yup.string().default('').trim().required(),
  info_suffix: yup.string().default(''),
  info_title: yup.string().default(''),
});

export const signatureSchema = yup.object().shape({
  signedDocName: yup.string(),
  signedAppDocObjId: yup.string(),
  uploadedAtUtc: yup.string(),
});

export const termsSchema = yup.object().shape({
  agreement: yup
    .boolean()
    .default(false)
    .meta({ shape: 'singleAcceptance', type: 'boolean' })
    .oneOf([true])
    .required(),
});

export const combinedSchema = {
  appendices: appendicesSchema,
  applicant: applicantSchema,
  collaborators: collaboratorSchema,
  dataAccessAgreement: dataAccessAgreementSchema,
  ethicsLetter: ethicsLetterSchema,
  projectInfo: projectInfoSchema,
  representative: representativeSchema,
  signature: signatureSchema,
  terms: termsSchema,
} as Record<FormSectionNames, any>;

export default yup;
