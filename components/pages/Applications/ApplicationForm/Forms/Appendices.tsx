import { ReactElement } from 'react';
import { css } from '@emotion/core';
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Link from '@icgc-argo/uikit/Link';
import Typography from '@icgc-argo/uikit/Typography';

import { FormFieldValidationTriggerFunction, FormSectionValidationState_Appendices } from './types';
import { isRequired } from './validations';
import StaticAppendices, { ICGCPolicies } from '../../PDF/StaticAppendices';
import FORM_TEXT from '../../PDF/textConstants';
import { AppendixEnum } from '../../types';
import { appendicesLinks } from 'global/constants';

const Appendices = ({
  isSectionDisabled,
  localState,
  validateFieldTouched,
}: {
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_Appendices;
  validateFieldTouched: FormFieldValidationTriggerFunction;
}): ReactElement => {
  return (
    <article>
      <StaticAppendices />

      <section>
        <ICGCPolicies />

        <Typography bold>
          {FORM_TEXT.appendices[AppendixEnum.ICGC_GOALS_POLICIES].title}
          <br />
          <Link
            css={css`
              font-size: 12px;
            `}
            href={appendicesLinks[AppendixEnum.ICGC_GOALS_POLICIES]}
            rel="noopener noreferrer"
            target="_blank"
            variant="BLOCK"
          >
            {FORM_TEXT.appendices.read_the_appendix}
          </Link>
        </Typography>

        <FormControl
          className="closer"
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.appendix_icgc_goals_policies?.error}
          required={isRequired(localState.agreements?.fields?.appendix_icgc_goals_policies)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.appendices.appendix_icgc_goals_policies.text}
            checked={localState.agreements?.fields?.appendix_icgc_goals_policies?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_icgc_goals_policies"
          >
            {FORM_TEXT.appendices.appendix_icgc_goals_policies.text}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_icgc_goals_policies?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          {FORM_TEXT.appendices[AppendixEnum.DATA_ACCESS_POLICY].title}
          <br />
          <Link
            css={css`
              font-size: 12px;
            `}
            href={appendicesLinks[AppendixEnum.DATA_ACCESS_POLICY]}
            rel="noopener noreferrer"
            target="_blank"
            variant="BLOCK"
          >
            {FORM_TEXT.appendices.read_the_appendix}
          </Link>
        </Typography>

        <FormControl
          className="closer"
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.appendix_data_access_policy?.error}
          required={isRequired(localState.agreements?.fields?.appendix_data_access_policy)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.appendices.appendix_data_access_policy.text}
            checked={localState.agreements?.fields?.appendix_data_access_policy?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_data_access_policy"
          >
            {FORM_TEXT.appendices.appendix_data_access_policy.text}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_data_access_policy?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          {FORM_TEXT.appendices[AppendixEnum.IP_POLICY].title}
          <br />
          <Link
            css={css`
              font-size: 12px;
            `}
            href={appendicesLinks[AppendixEnum.IP_POLICY]}
            rel="noopener noreferrer"
            target="_blank"
            variant="BLOCK"
          >
            {FORM_TEXT.appendices.read_the_appendix}
          </Link>
        </Typography>

        <FormControl
          className="closer"
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.appendix_ip_policy?.error}
          required={isRequired(localState.agreements?.fields?.appendix_ip_policy)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.appendices.appendix_ip_policy.text}
            checked={localState.agreements?.fields?.appendix_ip_policy?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_ip_policy"
          >
            {FORM_TEXT.appendices.appendix_ip_policy.text}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_ip_policy?.error?.[0]}
          </FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default Appendices;
