import React from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import { View, Text, StyleSheet } from '@react-pdf/renderer';
import PDFLayout from './PdfLayout';
import { PDFLink, PDFParagraph, PDFText, PDFTitle, SectionTitle } from './common';
import VerticalTable from './VerticalTable';
import { ApplicationData } from '../types';
import { ADOBE_ACROBAT_LINK, DOCUSIGN_LINK } from 'global/constants/externalPaths';

// const styles = StyleSheet.create({
//     par
// })

const Signatures = ({ data }: { data?: ApplicationData }) => {
  return (
    <PDFLayout appId={data?.appId} state={data?.state} applicant={data?.sections?.applicant.info}>
      <PDFTitle>Signatures</PDFTitle>
      <View>
        <PDFParagraph>
          The final step involves adding the proper signatures to authorize this application. Please
          do the following:
        </PDFParagraph>
        <PDFText count={1} style={{ fontWeight: 'semibold', marginBottom: '2pt' }}>
          You must include BOTH the Principal Investigator and the Institutional Representative
          signatures in order for your application to be reviewed.
        </PDFText>

        <PDFText style={{ marginLeft: '20pt' }}>
          a) You can print this page, collect the written signatures, scan the signed page and add
          it back to the finalized application pdf.
        </PDFText>
        <PDFText style={{ marginLeft: '20pt', marginBottom: '10pt' }}>
          b) Or you can add the proper signatures using electronic methods, such as{' '}
          <PDFLink href={DOCUSIGN_LINK}>DocuSign</PDFLink> or{' '}
          <PDFLink href={ADOBE_ACROBAT_LINK}>AdobeSign</PDFLink>.
        </PDFText>
        <PDFText count={2}>Upload the signed application to your online DACO application.</PDFText>
      </View>
      <View>
        <SectionTitle>APPLICANT AUTHORIZATION</SectionTitle>
      </View>
      <View>
        <SectionTitle>INSTITUTIONAL REPRESENTATIVE AUTHORIZATION</SectionTitle>
      </View>
      <View>
        <PDFParagraph>Reserved for the ICGC Data Access Compliance Office (ICGC DACO)</PDFParagraph>
      </View>
    </PDFLayout>
  );
};

export default Signatures;
