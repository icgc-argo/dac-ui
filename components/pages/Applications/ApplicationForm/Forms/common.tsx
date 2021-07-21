import { pdf, Document } from '@react-pdf/renderer';
import React, { Dispatch, SetStateAction } from 'react';
import { FILE_DATE_FORMAT } from '../../Dashboard/Applications/InProgress/constants';
import { getFormattedDate } from '../../Dashboard/Applications/InProgress/helpers';
import Cover from '../../PDF/Cover';
import Signatures from '../../PDF/Signatures';
import StaticAppendices from '../../PDF/StaticAppendices';
import StaticApplicant from '../../PDF/StaticApplicant';
import StaticCollaborators from '../../PDF/StaticCollaborators';
import StaticDataAccessAgreement from '../../PDF/StaticDataAccessAgreement';
import StaticEthics from '../../PDF/StaticEthics';
import StaticIntroduction from '../../PDF/StaticIntroduction';
import StaticProjectInfo from '../../PDF/StaticProjectInfo';
import StaticRepresentative from '../../PDF/StaticRepresentative';
import { saveAs } from 'file-saver';
import { css } from '@icgc-argo/uikit';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

// generate the PDF on request, so that app data is most recent (not when page is loaded)
export const generatePDFDocument = async (
  data: any,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
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
      <StaticDataAccessAgreement isPdf data={data} />
      <StaticAppendices isPdf data={data} />
      {/* Signatures is PDF only */}
      <Signatures data={data} />
    </Document>,
  ).toBlob();

  const dateCreated = getFormattedDate(Date.now(), FILE_DATE_FORMAT);
  saveAs(blob, `${data.appId}-${dateCreated}`);
  setIsLoading(false);
};

export const CustomLoadingButton = ({ text }: { text: string }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.colors.accent2_dark};
        width: 130px;
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
