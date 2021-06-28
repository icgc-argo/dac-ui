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
import FORM_TEXT from '../../PDF/textConstants';

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
            aria-label={FORM_TEXT.itAgreements.declarations.it_agreement_software_updates}
            checked={localState.agreements?.fields?.it_agreement_software_updates?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_software_updates"
          >
            <Typography bold component="span">
              {FORM_TEXT.itAgreements.yes}
            </Typography>
            {FORM_TEXT.itAgreements.commaSeparator}
            {FORM_TEXT.itAgreements.declarations.it_agreement_software_updates}
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
            aria-label={FORM_TEXT.itAgreements.declarations.it_agreement_protect_data}
            checked={localState.agreements?.fields?.it_agreement_protect_data?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_protect_data"
          >
            <Typography bold component="span">
              {FORM_TEXT.itAgreements.yes}
            </Typography>
            {FORM_TEXT.itAgreements.commaSeparator}
            {FORM_TEXT.itAgreements.declarations.it_agreement_protect_data}
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
            aria-label={FORM_TEXT.itAgreements.declarations.it_agreement_monitor_access}
            checked={localState.agreements?.fields?.it_agreement_monitor_access?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_monitor_access"
          >
            <Typography bold component="span">
              {FORM_TEXT.itAgreements.yes}
            </Typography>
            {FORM_TEXT.itAgreements.commaSeparator}
            {FORM_TEXT.itAgreements.declarations.it_agreement_monitor_access}
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
            aria-label={FORM_TEXT.itAgreements.declarations.it_agreement_destroy_copies}
            checked={localState.agreements?.fields?.it_agreement_destroy_copies?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_destroy_copies"
          >
            <Typography bold component="span">
              {FORM_TEXT.itAgreements.yes}
            </Typography>
            {FORM_TEXT.itAgreements.commaSeparator}
            {FORM_TEXT.itAgreements.declarations.it_agreement_destroy_copies}
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
            aria-label={FORM_TEXT.itAgreements.declarations.it_agreement_onboard_training}
            checked={localState.agreements?.fields?.it_agreement_onboard_training?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_onboard_training"
          >
            <Typography bold component="span">
              {FORM_TEXT.itAgreements.yes}
            </Typography>
            {FORM_TEXT.itAgreements.commaSeparator}
            {FORM_TEXT.itAgreements.declarations.it_agreement_onboard_training}
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
            aria-label={
              FORM_TEXT.itAgreements.declarations.it_agreement_provide_institutional_policies
            }
            checked={
              localState.agreements?.fields?.it_agreement_provide_institutional_policies?.value
            }
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_provide_institutional_policies"
          >
            <Typography bold component="span">
              {FORM_TEXT.itAgreements.yes}
            </Typography>
            {FORM_TEXT.itAgreements.commaSeparator}
            {FORM_TEXT.itAgreements.declarations.it_agreement_provide_institutional_policies}
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
            aria-label={FORM_TEXT.itAgreements.declarations.it_agreement_contact_daco_fraud}
            checked={localState.agreements?.fields?.it_agreement_contact_daco_fraud?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_contact_daco_fraud"
          >
            <Typography bold component="span">
              {FORM_TEXT.itAgreements.yes}
            </Typography>
            {FORM_TEXT.itAgreements.commaSeparator}
            {FORM_TEXT.itAgreements.declarations.it_agreement_contact_daco_fraud}
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
