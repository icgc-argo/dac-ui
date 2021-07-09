import React, { ReactElement, useState } from 'react';
import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { Document, pdf } from '@react-pdf/renderer';
import urlJoin from 'url-join';
import { saveAs } from 'file-saver';
import { isEqual } from 'lodash';

import StaticIntroduction from 'components/pages/Applications/PDF/StaticIntroduction';
import StaticApplicant from '../../PDF/StaticApplicant';
import { useAuthContext } from 'global/hooks';
import { APPLICATIONS_PATH } from 'global/constants/internalPaths';
import { AxiosError } from 'axios';
import StaticRepresentative from '../../PDF/StaticRepresentative';
import StaticCollaborators from '../../PDF/StaticCollaborators';
import StaticProjectInfo from '../../PDF/StaticProjectInfo';
import StaticEthics from '../../PDF/StaticEthics';
import StaticITAgreements from '../../PDF/StaticITAgreements';
import StaticDataAccessAgreement from '../../PDF/StaticDataAccessAgreement';
import StaticAppendices from '../../PDF/StaticAppendices';
import { getFormattedDate } from '../../Dashboard/Applications/InProgress/helpers';
import { FILE_DATE_FORMAT } from '../../Dashboard/Applications/InProgress/constants';
import Cover from '../../PDF/Cover';
import Signatures from '../../PDF/Signatures';
import { ApplicationState } from '../../types';

// EXPIRED and RENEWING handling is tbd, CLOSED excludes Action buttons
const getPdfButtonText: (state: ApplicationState) => string = (state) => {
  const text = 'PDF';

  if ([ApplicationState.DRAFT, ApplicationState.REVISIONS_REQUESTED].includes(state)) {
    return `DRAFT ${text}`;
  }
  if (isEqual(state, ApplicationState.SIGN_AND_SUBMIT)) {
    return `FINALIZED ${text}`;
  }
  if (
    [ApplicationState.REVIEW, ApplicationState.APPROVED, ApplicationState.REJECTED].includes(state)
  ) {
    return `SIGNED ${text}`;
  }
  console.warn('Illegal app state! State: ', state);
  return text;
};

const PDF_BUTTON_WIDTH = 130;

const CustomLoadingButton = ({ text }: { text: string }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.colors.accent2_dark};
        width: ${PDF_BUTTON_WIDTH}px;
      `}
    >
      <Icon
        name="spinner"
        width="12px"
        height="12px"
        fill={theme.colors.accent2_dark}
        css={css`
          margin-right: 9px;
        `}
      />
      {text}
    </div>
  );
};
const HeaderActions = ({
  appId,
  state,
}: {
  appId: string;
  state: ApplicationState;
}): ReactElement => {
  const theme: UikitTheme = useTheme();
  const { fetchWithAuth } = useAuthContext();
  const [pdfIsLoading, setPdfIsLoading] = useState<boolean>(false);

  // generate the PDF on request, so that app data is most recent (not when page is loaded)
  const generatePDFDocument = async (data: any) => {
    const blob = await pdf(
      <Document>
        {/* Cover is PDF only */}
        <Cover data={data} />
        <StaticIntroduction isPdf data={data} />
        <StaticApplicant isPdf data={data} />
        <StaticRepresentative isPdf data={data} />
        <StaticCollaborators isPdf data={data} />
        <StaticProjectInfo isPdf data={data} />
        <StaticEthics isPdf data={data} />
        <StaticITAgreements isPdf data={data} />
        <StaticDataAccessAgreement isPdf data={data} />
        <StaticAppendices isPdf data={data} />
        {/* Signatures is PDF only */}
        <Signatures data={data} />
      </Document>,
    ).toBlob();

    const dateCreated = getFormattedDate(Date.now(), FILE_DATE_FORMAT);
    saveAs(blob, `${data.appId}-${dateCreated}`);
    setPdfIsLoading(false);
  };

  const pdfButtonText = getPdfButtonText(state);

  return (
    <section
      css={css`
        display: flex;

        *:not(:last-of-type) {
          margin-right: 5px;
        }
      `}
    >
      <Button onClick={function noRefCheck() {}} size="sm" variant="secondary">
        Close Application
      </Button>
      <Button
        // setting width on button & CustomLoadingButton to prevent resize on loading state
        css={css`
          width: ${PDF_BUTTON_WIDTH}px;
        `}
        isAsync
        Loader={(props: any) => <CustomLoadingButton text={pdfButtonText} {...props} />}
        variant="secondary"
        isLoading={pdfIsLoading}
        onClick={async () => {
          setPdfIsLoading(true);
          const data = await fetchWithAuth({ url: urlJoin(APPLICATIONS_PATH, appId) })
            .then((res: any) => res.data)
            .catch((err: AxiosError) => {
              console.error('Application fetch failed, pdf not generated.', err);
              setPdfIsLoading(false);
              return null;
            });
          // if data fetch fails, do not proceed to pdf generation
          if (data) {
            generatePDFDocument(data);
          }
        }}
      >
        <Icon
          css={css`
            margin-bottom: -2px;
          `}
          fill={theme.colors.accent2_dark}
          height="12px"
          width="12px"
          name="download"
        />{' '}
        {pdfButtonText}
      </Button>
    </section>
  );
};

export default HeaderActions;
