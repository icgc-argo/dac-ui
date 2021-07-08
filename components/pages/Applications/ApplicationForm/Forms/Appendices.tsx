import { ReactElement } from 'react';
import { css } from '@emotion/core';
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Link from '@icgc-argo/uikit/Link';
import Typography from '@icgc-argo/uikit/Typography';

import RequiredFieldsMessage from './RequiredFieldsMessage';
import { FormFieldValidationTriggerFunction, FormSectionValidationState_Appendices } from './types';
import { isRequired } from './validations';
import StaticAppendices, { ICGCPolicies } from '../../PDF/StaticAppendices';
import FORM_TEXT from '../../PDF/textConstants';
import { AppendixEnum } from '../../types';

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
            href="#"
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
          {FORM_TEXT.appendices[AppendixEnum.LARGE_SCALE_DATA_SHARING].title}
          <br />
          <Link
            css={css`
              font-size: 12px;
            `}
            href="#"
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
          error={!!localState.agreements?.fields?.appendix_large_scale_data_sharing?.error}
          required={isRequired(localState.agreements?.fields?.appendix_large_scale_data_sharing)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.appendices.appendix_large_scale_data_sharing.text}
            checked={localState.agreements?.fields?.appendix_large_scale_data_sharing?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_large_scale_data_sharing"
          >
            {FORM_TEXT.appendices.appendix_large_scale_data_sharing.text}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_large_scale_data_sharing?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          {FORM_TEXT.appendices[AppendixEnum.PREPUBLICATION_POLICY].title}
          <br />
          <Link
            css={css`
              font-size: 12px;
            `}
            href="#"
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
          error={!!localState.agreements?.fields?.appendix_prepublication_policy?.error}
          required={isRequired(localState.agreements?.fields?.appendix_prepublication_policy)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.appendices.appendix_prepublication_policy.text}
            checked={localState.agreements?.fields?.appendix_prepublication_policy?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_prepublication_policy"
          >
            {FORM_TEXT.appendices.appendix_prepublication_policy.text}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_prepublication_policy?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          {FORM_TEXT.appendices[AppendixEnum.PUBLICATION_POLICY].title}
          <br />
          <Link
            css={css`
              font-size: 12px;
            `}
            href="#"
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
          error={!!localState.agreements?.fields?.appendix_publication_policy?.error}
          required={isRequired(localState.agreements?.fields?.appendix_publication_policy)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.appendices.appendix_publication_policy.text}
            checked={localState.agreements?.fields?.appendix_publication_policy?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_publication_policy"
          >
            {FORM_TEXT.appendices.appendix_publication_policy.text}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_publication_policy?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          {FORM_TEXT.appendices[AppendixEnum.NIH_GENOMIC_INVENTIONS].title}
          <br />
          <Link
            css={css`
              font-size: 12px;
            `}
            href="#"
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
          error={!!localState.agreements?.fields?.appendix_nih_genomic_inventions?.error}
          required={isRequired(localState.agreements?.fields?.appendix_nih_genomic_inventions)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.appendices.appendix_nih_genomic_inventions.text}
            checked={localState.agreements?.fields?.appendix_nih_genomic_inventions?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_nih_genomic_inventions"
          >
            {FORM_TEXT.appendices.appendix_nih_genomic_inventions.text}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_nih_genomic_inventions?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          {FORM_TEXT.appendices[AppendixEnum.OECD_GENETIC_INVENTIONS].title}
          <br />
          <Link
            css={css`
              font-size: 12px;
            `}
            href="#"
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
          error={!!localState.agreements?.fields?.appendix_oecd_genetic_inventions?.error}
          required={isRequired(localState.agreements?.fields?.appendix_oecd_genetic_inventions)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.appendices.appendix_oecd_genetic_inventions.text}
            checked={localState.agreements?.fields?.appendix_oecd_genetic_inventions?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_oecd_genetic_inventions"
          >
            {FORM_TEXT.appendices.appendix_oecd_genetic_inventions.text}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_oecd_genetic_inventions?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          {FORM_TEXT.appendices[AppendixEnum.CLOUD_SECURITY].title}
          <br />
          <Link
            css={css`
              font-size: 12px;
            `}
            href="#"
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
          error={!!localState.agreements?.fields?.appendix_cloud_security?.error}
          required={isRequired(localState.agreements?.fields?.appendix_cloud_security)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.appendices.appendix_cloud_security.text}
            checked={localState.agreements?.fields?.appendix_cloud_security?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_cloud_security"
          >
            {FORM_TEXT.appendices.appendix_cloud_security.text}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_cloud_security?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          {FORM_TEXT.appendices[AppendixEnum.GA4GH_FRAMEWORK].title}
          <br />
          <Link
            css={css`
              font-size: 12px;
            `}
            href="#"
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
          error={!!localState.agreements?.fields?.appendix_ga4gh_framework?.error}
          required={isRequired(localState.agreements?.fields?.appendix_ga4gh_framework)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.appendices.appendix_ga4gh_framework.text}
            checked={localState.agreements?.fields?.appendix_ga4gh_framework?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_ga4gh_framework"
          >
            {FORM_TEXT.appendices.appendix_ga4gh_framework.text}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_ga4gh_framework?.error?.[0]}
          </FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default Appendices;
