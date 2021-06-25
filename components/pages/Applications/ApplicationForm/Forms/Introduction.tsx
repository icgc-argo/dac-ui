import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Typography from '@icgc-argo/uikit/Typography';
import StaticIntroduction from 'components/pages/Applications/PDF/StaticIntroduction';
import { useState, useEffect } from 'react';
import { PDFViewer, Document } from '@react-pdf/renderer';
import {
  FormSectionValidationState_Introduction,
  FormSectionValidatorFunction_Origin,
} from './types';
import { isRequired, useLocalValidation } from './validations';
import { css } from '@icgc-argo/uikit';
import StaticApplicant from '../../PDF/StaticApplicant';
import FORM_TEXT from '../../PDF/textConstants';

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

  // for local testing, will be removed when pdf feature complete
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    // cannot render PDFDownloadLink on server side, dynamically importing did not resolve the issue
    setIsClient(true);
  }, []);

  return (
    <article>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        {/* PDFViewer is for testing locally, so commenting out in pr. Will be removed when pdf feature completed */}
        {/* {isClient && (
          <PDFViewer height="800" width="500">
            <Document>
              <StaticIntroduction isPdf />
              <StaticApplicant isPdf />
            </Document>
          </PDFViewer>
        )} */}
      </div>

      <StaticIntroduction />
      <section>
        <Typography bold component="h3" color="secondary">
          {FORM_TEXT.introduction.title}
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
