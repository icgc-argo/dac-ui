import { css } from '@emotion/core';
import { UikitTheme } from '@icgc-argo/uikit/index';
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Link from '@icgc-argo/uikit/Link';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';

import RequiredFieldsMessage from './RequiredFieldsMessage';
import {
  FormSectionValidationState_ITAgreements,
  FormSectionValidatorFunction_Origin,
} from './types';
import { isRequired, useLocalValidation } from './validations';

const ITAgreements = ({
  isSectionDisabled,
  storedFields,
  validateSection,
}: {
  isSectionDisabled: boolean;
  storedFields: FormSectionValidationState_ITAgreements;
  validateSection: FormSectionValidatorFunction_Origin;
}) => {
  const theme: UikitTheme = useTheme();
  const {
    localState,
    validateFieldTouched,
  }: {
    localState: FormSectionValidationState_ITAgreements;
    validateFieldTouched: (event: any) => void;
  } = useLocalValidation(storedFields, validateSection('itAgreements'));

  return (
    <article>
      <Typography bold component="h2">
        F. Information Technology Agreements
      </Typography>

      <section>
        <Typography>
          In order to avoid inadvertent disclosure of ICGC Controlled Data to unauthorized
          individuals, DACO asks that you observe basic information security practices. If you make
          local copies of ICGC Controlled Data, you must minimize the risk that this information
          might be used and/or disclosed to persons who have not been approved for access to ICGC
          Controlled Data.
        </Typography>

        <RequiredFieldsMessage />
      </section>

      <section>
        <Typography bold component="h3" color="secondary">
          IT AGREEMENT
        </Typography>

        <Typography
          css={css`
            font-size: 13px;
            margin: 0 !important;
          `}
        >
          At a minimum, you agree to the following:
        </Typography>

        <Typography
          component="ol"
          css={css`
            font-size: 13px;
            margin-left: -10px;
            padding: 0;

            li {
              padding: 10px;
              list-style-position: inside;

              &:nth-of-type(even) {
                background: ${theme.colors.grey_4};
              }
            }
          `}
        >
          <li>
            <Typography bold component="span">
              Physical Security
            </Typography>{' '}
            - ICGC Controlled Data will be maintained on physically secure computer systems, such as
            in a locked office. If the data is stored on a laptop computer, it must be encrypted to
            avoid its disclosure in case of loss or theft.
          </li>
          <li>
            <Typography bold component="span">
              Access Security
            </Typography>{' '}
            - Only individuals who are listed in this application will have access to ICGC
            Controlled Data. If copies of the ICGC Controlled Data are stored locally on a shared
            computer system or a file server, then they must be strong password and/or encryption
            protected so that only the individuals named in the application have access to it. If
            the computer that holds ICGC Controlled Data is backed up, the backup media must be
            encrypted and/or stored in a physically secure location.
          </li>
          <li>
            <Typography bold component="span">
              Network Security
            </Typography>{' '}
            - If ICGC Controlled Data is stored on a network-accessible computer, there must be
            controls in place to prevent access by computer "hackers", or contamination by viruses,
            malware and spyware. Network security is usually implemented by your institution's IT
            department and will consist of some combination of network firewalls, network intrusion
            monitoring, and virus scanning software.
          </li>
          <li>
            <Typography bold component="span">
              End of Project
            </Typography>{' '}
            - After finishing the Research Project for which you are requesting access or if your
            access approval is terminated, you must securely destroy all local copies of the ICGC
            controlled Data, including any backup copies. However, if necessary, you may still keep
            the ICGC Controlled Data for archival purpose in conformity with national audits or
            other legal requirements.
          </li>
          <li>
            <Typography bold component="span">
              Training
            </Typography>{' '}
            - Everyone who will access and/or use ICGC Controlled Data must be trained in the
            responsible use of personal health information, familiarized with the terms and
            conditions of the data Access Agreement, and briefed on your security plans.
          </li>
          <li>
            <Typography bold component="span">
              Computer Cloud Use
            </Typography>{' '}
            - You may place copies of ICGC Controlled Data on a private or commercial computer cloud
            for analytical purposes. If you do so, you acknowledge that you maintain responsibility
            for the data and you agree that: you must take care to apply strong encryption to the
            data while in motion and at rest; restrict access to stored copies of the data to
            yourself, authorized personnel, students, and authorized collaborators; use firewall
            rules to restrict ingress and egress from virtual machines to trusted network
            address(es); keep virtual machines that host controlled data up to date with security
            patches; and destroy all copies of the data, including snapshots and backups, at the end
            of the research Project or if your application is not renewed; and ensure there is an
            agreement in place with your cloud provider that ensures you can meet these
            requirements. Any use of a private or commercial cloud is between you and the cloud
            provider. To the extent permitted by law OICR accepts no responsibility for any
            interaction between you and the cloud provider and is released from any liability
            arising out of or in any way connected with such interaction.
          </li>
        </Typography>

        <Typography
          css={css`
            font-size: 13px;
            margin: 15px 0 !important;
          `}
        >
          Access to ICGC Controlled Data is a procedure that entails legal and ethical obligations.
          You and your institution must have modern, up to date, information technology (IT)
          policies in place that must minimally include the following items:
        </Typography>

        <Typography
          component="ul"
          css={css`
            font-size: 13px;
            list-style-position: inside;
            padding-left: 0;
          `}
        >
          <li>Logging and auditing of access to data and to computer network</li>
          <li>Password protection to computer network</li>
          <li>Virus and malware protection to computers on computer network</li>
          <li>Auditable data destruction procedure, when necessary</li>
          <li>Secure data backup procedure, when necessary</li>
          <li>
            Strong encryption on any portable device which may store or provide access to ICGC
            controlled access data
          </li>
          <li>Privacy breach notification</li>
        </Typography>

        <Typography css={css``} bold>
          You MUST agree to the following procedures in order to have access to the ICGC Controlled
          Data:
        </Typography>

        <FormControl
          error={!!localState.agreements?.fields?.it_agreement_software_updates?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_software_updates)}
        >
          <FormCheckbox
            aria-label="You will keep all computer systems on which ICGC Controlled Data reside, or which
            provide access to such data, up-to-date with respect to software patches and antivirus
            file definitions (if applicable)."
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.it_agreement_software_updates?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_software_updates"
          >
            <Typography bold component="span">
              Yes
            </Typography>
            , You will keep all computer systems on which ICGC Controlled Data reside, or which
            provide access to such data, up-to-date with respect to software patches and antivirus
            file definitions (if applicable).
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_software_updates?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          error={!!localState.agreements?.fields?.it_agreement_protect_data?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_protect_data)}
        >
          <FormCheckbox
            aria-label="You will protect ICGC Controlled Data against disclosure to and use by unauthorized
            individuals."
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.it_agreement_protect_data?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_protect_data"
          >
            <Typography bold component="span">
              Yes
            </Typography>
            , You will protect ICGC Controlled Data against disclosure to and use by unauthorized
            individuals.
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_protect_data?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          error={!!localState.agreements?.fields?.it_agreement_monitor_access?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_monitor_access)}
        >
          <FormCheckbox
            aria-label="You will monitor and control which individuals have access to ICGC controlled Data."
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.it_agreement_monitor_access?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_monitor_access"
          >
            <Typography bold component="span">
              Yes
            </Typography>
            , You will monitor and control which individuals have access to ICGC controlled Data.
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_monitor_access?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          error={!!localState.agreements?.fields?.it_agreement_destroy_copies?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_destroy_copies)}
        >
          <FormCheckbox
            aria-label="You will securely destroy all copies of ICGC Controlled Data in accordance with the
            terms and conditions of the Data Access Agreement."
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.it_agreement_destroy_copies?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_destroy_copies"
          >
            <Typography bold component="span">
              Yes
            </Typography>
            , You will securely destroy all copies of ICGC Controlled Data in accordance with the
            terms and conditions of the Data Access Agreement.
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_destroy_copies?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          error={!!localState.agreements?.fields?.it_agreement_onboard_training?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_onboard_training)}
        >
          <FormCheckbox
            aria-label="You will familiarize all individuals who have access to ICGC Controlled Data with the
            restrictions on its use."
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.it_agreement_onboard_training?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_onboard_training"
          >
            <Typography bold component="span">
              Yes
            </Typography>
            , You will familiarize all individuals who have access to ICGC Controlled Data with the
            restrictions on its use.
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_onboard_training?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          error={
            !!localState.agreements?.fields?.it_agreement_provide_institutional_policies?.error
          }
          required={isRequired(
            localState.agreements?.fields?.it_agreement_provide_institutional_policies,
          )}
        >
          <FormCheckbox
            aria-label="You agree to swiftly provide a copy of both your institutional and Research Project
            related IT policy documents upon request from a DACO representative."
            disabled={isSectionDisabled}
            checked={
              localState.agreements?.fields?.it_agreement_provide_institutional_policies?.value
            }
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_provide_institutional_policies"
          >
            <Typography bold component="span">
              Yes
            </Typography>
            , You agree to swiftly provide a copy of both your institutional and Research Project
            related IT policy documents upon request from a DACO representative.
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_provide_institutional_policies?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          error={!!localState.agreements?.fields?.it_agreement_contact_daco_fraud?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_contact_daco_fraud)}
        >
          <FormCheckbox
            aria-label="You will notify the DACO immediately if you become aware or suspect that someone has
            gained unauthorized access to the ICGC Controlled Data."
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.it_agreement_contact_daco_fraud?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_contact_daco_fraud"
          >
            <Typography bold component="span">
              Yes
            </Typography>
            , You will notify the DACO immediately if you become aware or suspect that someone has
            gained unauthorized access to the ICGC Controlled Data.
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_contact_daco_fraud?.error?.[0]}
          </FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default ITAgreements;
