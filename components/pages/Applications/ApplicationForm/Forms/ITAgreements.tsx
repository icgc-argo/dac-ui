import { ReactElement } from 'react';
import { css } from '@emotion/core';
import { UikitTheme } from '@icgc-argo/uikit/index';
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';

import {
  FormFieldValidationTriggerFunction,
  FormSectionValidationState_ITAgreements,
} from './types';
import StaticITAgreements from '../../PDF/StaticITAgreements';
import { isRequired } from './validations';

const ITAgreements = ({
  isSectionDisabled,
  localState,
  validateFieldTouched,
}: {
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_ITAgreements;
  validateFieldTouched: FormFieldValidationTriggerFunction;
}): ReactElement => {
  const theme: UikitTheme = useTheme();

  return (
    <article>
      <StaticITAgreements />

      {/* getting that extra grey bar here from the article > section styling */}
      <section>
        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.it_agreement_software_updates?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_software_updates)}
        >
          <FormCheckbox
            aria-label="You will keep all computer systems on which ICGC Controlled Data reside, or which
            provide access to such data, up-to-date with respect to software patches and antivirus
            file definitions (if applicable)."
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
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.it_agreement_protect_data?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_protect_data)}
        >
          <FormCheckbox
            aria-label="You will protect ICGC Controlled Data against disclosure to and use by unauthorized
            individuals."
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
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.it_agreement_monitor_access?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_monitor_access)}
        >
          <FormCheckbox
            aria-label="You will monitor and control which individuals have access to ICGC controlled Data."
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
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.it_agreement_destroy_copies?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_destroy_copies)}
        >
          <FormCheckbox
            aria-label="You will securely destroy all copies of ICGC Controlled Data in accordance with the
            terms and conditions of the Data Access Agreement."
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
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.it_agreement_onboard_training?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_onboard_training)}
        >
          <FormCheckbox
            aria-label="You will familiarize all individuals who have access to ICGC Controlled Data with the
            restrictions on its use."
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
          disabled={isSectionDisabled}
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
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.it_agreement_contact_daco_fraud?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_contact_daco_fraud)}
        >
          <FormCheckbox
            aria-label="You will notify the DACO immediately if you become aware or suspect that someone has
            gained unauthorized access to the ICGC Controlled Data."
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
