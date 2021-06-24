import React, { ReactElement, useEffect, useState } from 'react';
import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { Document, Page, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import StaticIntroduction from 'components/pages/Applications/PDF/StaticIntroduction';
import StaticApplicant from '../../PDF/StaticApplicant';
import { useAuthContext } from 'global/hooks';
import { APPLICATIONS_PATH } from 'global/constants/internalPaths';
import urlJoin from 'url-join';
import { saveAs } from 'file-saver';

// make a function to parse out all the app data the pdf form needs, so you're only passing that around

const HeaderActions = ({ appId }: { appId: string }): ReactElement => {
  const theme: UikitTheme = useTheme();
  const [isClient, setIsClient] = useState(false);
  const { fetchWithAuth } = useAuthContext();

  // generate the PDF on request, so that app data is most recent (not when page is loaded)
  const generatePDFDocument = async (data: any) => {
    const blob = await pdf(
      <Document>
        <StaticIntroduction isPdf data={data} />
        <StaticApplicant isPdf data={data} />
      </Document>,
    ).toBlob();

    saveAs(blob, 'testPage');
  };

  useEffect(() => {
    // cannot render PDFDownloadLink on server side, dynamically importing did not resolve the issue
    setIsClient(true);
  }, []);

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
        isAsync
        variant="secondary"
        size="sm"
        onClick={async () => {
          const data = await fetchWithAuth({ url: urlJoin(APPLICATIONS_PATH, appId) })
            .then((res: any) => {
              if (res.status === 200) {
                return res.data;
              }
            })
            .catch((err: any) => console.log('ERROR! ', err));
          generatePDFDocument(data);
        }}
      >
        Draft PDF
      </Button>
      {/* {isClient && (
        <PDFDownloadLink
          css={css`
            text-decoration: none;
            margin-left: 0.5rem;
          `}
          document={<AppFormPDF />}
          fileName="test_pdf.pdf"
        >
          {({ blob, url, loading, error }) => (
            <Button
              onClick={function noRefCheck() {}}
              size="sm"
              variant="secondary"
              disabled={loading}
              isLoading={loading}
            >
              <Icon
                css={css`
                  margin-bottom: -2px;
                `}
                fill={theme.colors.accent2_dark}
                height="12px"
                name="download"
              />{' '}
              <span>{loading ? 'Loading PDF...' : 'Draft PDF'}</span>
            </Button>
          )}
        </PDFDownloadLink>
      )} */}
    </section>
  );
};

export default HeaderActions;
