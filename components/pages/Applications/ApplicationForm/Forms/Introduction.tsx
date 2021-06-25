import { ReactElement, useState, useEffect } from 'react';
import { PDFViewer, Document } from '@react-pdf/renderer';
import { css } from '@emotion/core';
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Typography from '@icgc-argo/uikit/Typography';

import StaticIntroduction from 'components/pages/Applications/PDF/StaticIntroduction';

import FORM_TEXT from '../../PDF/textConstants';
import {
  FormFieldValidationTriggerFunction,
  FormSectionValidationState_Introduction,
} from './types';
import { isRequired } from './validations';

const Introduction = ({
  isSectionDisabled,
  localState,
  validateFieldTouched,
}: {
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_Introduction;
  validateFieldTouched: FormFieldValidationTriggerFunction;
}): ReactElement => {
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
