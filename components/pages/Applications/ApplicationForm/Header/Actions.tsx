import React, { ReactElement } from 'react';
import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { Document, pdf } from '@react-pdf/renderer';
import urlJoin from 'url-join';
import { saveAs } from 'file-saver';

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

const HeaderActions = ({ appId }: { appId: string }): ReactElement => {
  const theme: UikitTheme = useTheme();
  const { fetchWithAuth } = useAuthContext();

  // generate the PDF on request, so that app data is most recent (not when page is loaded)
  const generatePDFDocument = async (data: any) => {
    const blob = await pdf(
      <Document>
        <StaticIntroduction isPdf data={data} />
        <StaticApplicant isPdf data={data} />
        <StaticRepresentative isPdf data={data} />
        <StaticCollaborators isPdf data={data} />
        <StaticProjectInfo isPdf data={data} />
        {/* <StaticEthics isPdf data={data} /> */}
        {/* <StaticITAgreements isPdf data={data} /> */}
        {/* <StaticDataAccessAgreement isPdf data={data} /> */}
        {/* <StaticAppendices isPdf data={data} /> */}
      </Document>,
    ).toBlob();

    saveAs(blob, `${data.appId}-${data.state}`);
  };

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
            .then((res: any) => res.data)
            .catch((err: AxiosError) => {
              console.error('Application fetch failed, pdf not generated.', err);
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
          name="download"
        />{' '}
        {/* hardcoded 'Draft' for now but button text will reflect application state when data hookup is complete */}
        Draft PDF
      </Button>
    </section>
  );
};

export default HeaderActions;
