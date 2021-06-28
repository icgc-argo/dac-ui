import { ReactElement, useState, useEffect } from 'react';
import { PDFViewer, Document } from '@react-pdf/renderer';
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Typography from '@icgc-argo/uikit/Typography';

import StaticIntroduction from 'components/pages/Applications/PDF/StaticIntroduction';

import {
  FormFieldValidationTriggerFunction,
  FormSectionValidationState_Introduction,
} from './types';
import { isRequired } from './validations';
import { css } from '@icgc-argo/uikit';
import StaticApplicant from '../../PDF/StaticApplicant';
import FORM_TEXT from '../../PDF/textConstants';
import urlJoin from 'url-join';
import { AxiosError } from 'axios';
import { APPLICATIONS_PATH } from 'global/constants/internalPaths';
import { useAuthContext } from 'global/hooks';
import StaticRepresentative from '../../PDF/StaticRepresentative';
import StaticCollaborators from '../../PDF/StaticCollaborators';
import StaticProjectInfo from '../../PDF/StaticProjectInfo';
import StaticEthics from '../../PDF/StaticEthics';
import StaticITAgreements from '../../PDF/StaticITAgreements';

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
  const { fetchWithAuth } = useAuthContext();
  const [pdfData, setPdfData] = useState(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    fetchWithAuth({ url: urlJoin(APPLICATIONS_PATH, 'DACO-5') })
      .then((res: any) => setPdfData(res.data))
      .catch((err: AxiosError) => {
        setPdfData(null);
        console.error('Application fetch failed, pdf not generated.', err);
        return null;
      });
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
        {isClient && pdfData && (
          <PDFViewer height="800" width="500">
            <Document>
              <StaticIntroduction isPdf data={pdfData} />
              <StaticApplicant isPdf data={pdfData} />
              <StaticRepresentative isPdf data={pdfData} />
              <StaticCollaborators isPdf data={pdfData} />
              <StaticProjectInfo isPdf data={pdfData} />
              <StaticEthics isPdf data={pdfData} />
              <StaticITAgreements isPdf data={pdfData} />
              {/* <StaticDataAccessAgreement isPdf data={pdfData} /> */}
              {/* <StaticAppendices isPdf data={pdfData} /> */}
            </Document>
          </PDFViewer>
        )}
      </div>

      <StaticIntroduction />
      <section>
        <Typography bold component="h3" color="secondary">
          {FORM_TEXT.introduction.title}
        </Typography>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreement?.error}
          required={isRequired(localState.agreement)}
        >
          <FormCheckbox
            aria-label="I acknowledge that I have read and understand the above terms."
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
