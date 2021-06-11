import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Link from '@icgc-argo/uikit/Link';
import Typography from '@icgc-argo/uikit/Typography';

import RequiredFieldsMessage from './RequiredFieldsMessage';
import {
  FormSectionValidationState_Introduction,
  FormSectionValidatorFunction_Origin,
} from './types';
import { isRequired, useLocalValidation } from './validations';

const Introduction = ({
  isSectionDisabled,
  storedFields,
  validateSection,
}: {
  isSectionDisabled: boolean;
  storedFields: FormSectionValidationState_Introduction;
  validateSection: FormSectionValidatorFunction_Origin;
}) => {
  const {
    localState,
    validateFieldTouched,
  }: {
    localState: FormSectionValidationState_Introduction;
    validateFieldTouched: (event: any) => void;
  } = useLocalValidation(storedFields, validateSection('introduction'));

  return (
    <article>
      <Typography bold component="h2">
        Introduction
      </Typography>

      <section>
        <Typography>
          This application form must be completed by you and the legal entity with which you are
          affiliated (“You”) prior to being granted access to International Cancer Genome Consortium
          (“ICGC”) controlled data (the “ICGC Controlled Data” as further defined in Section G of
          this application). To receive access, you must complete this entire application form and
          agree to its terms by signing Section G of this application. All sections, as well as
          Appendices I through VIII, are integral components of this application. Your Research
          Project will be checked for conformity with the{' '}
          <Link href="#" rel="noopener noreferrer" target="_blank">
            goals and policies of ICGC
          </Link>{' '}
          (see Appendix I) including, but not limited to, policies concerning the purpose and
          relevance of the research, the protection of the participants and the security of the
          participants’ data.
        </Typography>

        <Typography>
          The terms You accept in this application, form an agreement between You and the{' '}
          <Link href="#" rel="noopener noreferrer" target="_blank">
            Ontario Institute for Cancer Research (“OICR”)
          </Link>{' '}
          which is the legal entity that administrates the ICGC Controlled Data on behalf of ICGC
          member institutions. OICR includes its employees, officers, directors, contractors,
          subcontractors and agents (including the DACO, as defined immediately below).
        </Typography>

        <Typography>
          If the Data Access Compliance Office of the ICGC (the “DACO”), approves your application,
          access to the ICGC Controlled Data will be granted for a one year period (starting from
          the date You are approved for access). An Annual Renewal Application must be completed by
          You in order to access/use controlled data beyond that one-year time period and thereafter
          as applicable.
        </Typography>

        <Typography>
          If your application is approved, You agree that Your application information will be
          included in a registry containing the applicants’ names, institutions and lay summaries of
          the scientific abstracts of all applicants having been granted access to ICGC Controlled
          Data. The ICGC DACO Approved Projects are posted on the{' '}
          <Link href="#" rel="noopener noreferrer" target="_blank">
            ICGC ARGO website
          </Link>
          .
        </Typography>
        <RequiredFieldsMessage />
      </section>

      <section>
        <Typography bold component="h3" color="secondary">
          ACKNOWLEDGEMENT
        </Typography>

        <FormControl
          error={!!localState.agreement?.error}
          required={isRequired(localState.agreement)}
        >
          <FormCheckbox
            aria-label="I acknowledge that I have read and understand the above terms."
            disabled={isSectionDisabled}
            checked={localState.agreement?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreement"
          >
            <Typography bold component="span">
              I acknowledge
            </Typography>{' '}
            that I have read and understand the above terms.
          </FormCheckbox>

          <FormHelperText onErrorOnly>{localState.agreement?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default Introduction;
