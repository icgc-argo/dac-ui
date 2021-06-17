import { css } from '@emotion/core';
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Link from '@icgc-argo/uikit/Link';
import Typography from '@icgc-argo/uikit/Typography';

import RequiredFieldsMessage from './RequiredFieldsMessage';
import {
  FormSectionValidationState_Appendices,
  FormSectionValidatorFunction_Origin,
} from './types';
import { isRequired, useLocalValidation } from './validations';

const Appendices = ({
  isSectionDisabled,
  storedFields,
  validateSection,
}: {
  isSectionDisabled: boolean;
  storedFields: FormSectionValidationState_Appendices;
  validateSection: FormSectionValidatorFunction_Origin;
}) => {
  const {
    localState,
    validateFieldTouched,
  }: {
    localState: FormSectionValidationState_Appendices;
    validateFieldTouched: (event: any) => void;
  } = useLocalValidation(storedFields, validateSection('appendices'));

  return (
    <article>
      <Typography bold component="h2">
        H. Appendices
      </Typography>

      <section>
        <Typography>Please review and agree to the following Appendices.</Typography>

        <RequiredFieldsMessage />
      </section>

      <section>
        <Typography bold component="h3" color="secondary">
          ICGC POLICIES
        </Typography>

        <Typography bold>
          APPENDIX I - INTERNATIONAL CANCER GENOME CONSORTIUM, GOALS, STRUCTURE, POLICIES &
          GUIDELINES (2008)
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
            Read the Appendix
          </Link>
        </Typography>

        <FormControl
          className="closer"
          error={!!localState.agreements?.fields?.appendix_icgc_goals_policies?.error}
          required={isRequired(localState.agreements?.fields?.appendix_icgc_goals_policies)}
        >
          <FormCheckbox
            aria-label="You have read APPENDIX I"
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.appendix_icgc_goals_policies?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_icgc_goals_policies"
          >
            You have read{' '}
            <Link href="#" rel="noopener noreferrer" target="_blank">
              APPENDIX I
            </Link>
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_icgc_goals_policies?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          APPENDIX II - SHARING DATA FROM LARGE-SCALE BIOLOGICAL RESEARCH PROJECTS: A SYSTEM OF
          TRIPARTITE RESPONSIBILITY "THE FT. LAUDERDALE GUIDELINES" (2003)
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
            Read the Appendix
          </Link>
        </Typography>

        <FormControl
          className="closer"
          error={!!localState.agreements?.fields?.appendix_large_scale_data_sharing?.error}
          required={isRequired(localState.agreements?.fields?.appendix_large_scale_data_sharing)}
        >
          <FormCheckbox
            aria-label="You have read APPENDIX II"
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.appendix_large_scale_data_sharing?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_large_scale_data_sharing"
          >
            You have read{' '}
            <Link href="#" rel="noopener noreferrer" target="_blank">
              APPENDIX II
            </Link>
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_large_scale_data_sharing?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          APPENDIX III - TORONTO INTERNATIONAL DATA RELEASE WORKSHOP AUTHORS, PREPUBLICATION DATA
          SHARING - NATURE 461 (10) 168. (2009)
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
            Read the Appendix
          </Link>
        </Typography>

        <FormControl
          className="closer"
          error={!!localState.agreements?.fields?.appendix_prepublication_policy?.error}
          required={isRequired(localState.agreements?.fields?.appendix_prepublication_policy)}
        >
          <FormCheckbox
            aria-label="You have read APPENDIX III"
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.appendix_prepublication_policy?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_prepublication_policy"
          >
            You have read{' '}
            <Link href="#" rel="noopener noreferrer" target="_blank">
              APPENDIX III
            </Link>
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_prepublication_policy?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          APPENDIX IV - INTERNATIONAL CANCER GENOME CONSORTIUM, UPDATE TO GOALS, STRUCTURE, POLICIES
          & GUIDELINES - SECTION E.3 PUBLICATION POLICY (2008 INCLUDING 2010 AND 2012 UPDATES)
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
            Read the Appendix
          </Link>
        </Typography>

        <FormControl
          className="closer"
          error={!!localState.agreements?.fields?.appendix_publication_policy?.error}
          required={isRequired(localState.agreements?.fields?.appendix_publication_policy)}
        >
          <FormCheckbox
            aria-label="You have read APPENDIX IV"
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.appendix_publication_policy?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_publication_policy"
          >
            You have read{' '}
            <Link href="#" rel="noopener noreferrer" target="_blank">
              APPENDIX IV
            </Link>
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_publication_policy?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          APPENDIX V - NATIONAL INSTITUTES OF HEALTH, BEST PRACTICES FOR THE LICENSING OF GENOMIC
          INVENTIONS (2005)
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
            Read the Appendix
          </Link>
        </Typography>

        <FormControl
          className="closer"
          error={!!localState.agreements?.fields?.appendix_nih_genomic_inventions?.error}
          required={isRequired(localState.agreements?.fields?.appendix_nih_genomic_inventions)}
        >
          <FormCheckbox
            aria-label="You have read APPENDIX V"
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.appendix_nih_genomic_inventions?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_nih_genomic_inventions"
          >
            You have read{' '}
            <Link href="#" rel="noopener noreferrer" target="_blank">
              APPENDIX V
            </Link>
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_nih_genomic_inventions?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          APPENDIX VI - OECD, GUIDELINES FOR THE LICENSING OF GENETIC INVENTIONS (2006)
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
            Read the Appendix
          </Link>
        </Typography>

        <FormControl
          className="closer"
          error={!!localState.agreements?.fields?.appendix_oecd_genetic_inventions?.error}
          required={isRequired(localState.agreements?.fields?.appendix_oecd_genetic_inventions)}
        >
          <FormCheckbox
            aria-label="You have read APPENDIX VI"
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.appendix_oecd_genetic_inventions?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_oecd_genetic_inventions"
          >
            You have read{' '}
            <Link href="#" rel="noopener noreferrer" target="_blank">
              APPENDIX VI
            </Link>
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_oecd_genetic_inventions?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          APPENDIX VII - ICGC DCC: BEST PRACTICES FOR SECURING CONTROLLED DATA IN THE CLOUD (2015)
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
            Read the Appendix
          </Link>
        </Typography>

        <FormControl
          className="closer"
          error={!!localState.agreements?.fields?.appendix_cloud_security?.error}
          required={isRequired(localState.agreements?.fields?.appendix_cloud_security)}
        >
          <FormCheckbox
            aria-label="You have read APPENDIX VII"
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.appendix_cloud_security?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_cloud_security"
          >
            You have read{' '}
            <Link href="#" rel="noopener noreferrer" target="_blank">
              APPENDIX VII
            </Link>
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.appendix_cloud_security?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <Typography bold>
          APPENDIX VIII - GA4GH, FRAMEWORK FOR RESPONSIBLE SHARING OF GENOMIC AND HEALTH-RELATED
          DATA (2014)
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
            Read the Appendix
          </Link>
        </Typography>

        <FormControl
          className="closer"
          error={!!localState.agreements?.fields?.appendix_ga4gh_framework?.error}
          required={isRequired(localState.agreements?.fields?.appendix_ga4gh_framework)}
        >
          <FormCheckbox
            aria-label="You have read APPENDIX VIII"
            disabled={isSectionDisabled}
            checked={localState.agreements?.fields?.appendix_ga4gh_framework?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--appendix_ga4gh_framework"
          >
            You have read{' '}
            <Link href="#" rel="noopener noreferrer" target="_blank">
              APPENDIX VIII
            </Link>
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
