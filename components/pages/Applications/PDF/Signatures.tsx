import React from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import { View, StyleSheet } from '@react-pdf/renderer';
import PDFLayout from './PdfLayout';
import { PdfFormFields, PDFLink, PDFParagraph, PDFText, PDFTitle, SectionTitle } from './common';
import VerticalTable from './VerticalTable';
import { ApplicationData } from '../types';
import { ADOBE_ACROBAT_LINK, DOCUSIGN_LINK } from 'global/constants/externalPaths';
import { FieldAccessor, PdfFieldName, PdfFormField } from './types';
import { styles as commonStyles } from './common';

const styles = StyleSheet.create({
  table: {
    marginBottom: '25pt',
    borderBottom: `1pt solid ${defaultTheme.colors.grey_1}`,
  },
});

const Signature = () => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      height: '30pt',
    }}
  >
    <PDFText style={{ fontWeight: 'semibold', marginRight: '10pt' }}>Signature:</PDFText>
    <View
      style={{
        borderTop: `2pt solid ${defaultTheme.colors.black}`,
        marginTop: '2pt',
        width: '90%',
      }}
    />
  </View>
);

// data needs to be ApplicationData type. needs to be fixed here and in other verticalTable usages
const Signatures = ({ data }: { data?: ApplicationData }) => {
  const signerFields = [
    PdfFormFields.NAME,
    PdfFormFields.PRIMARY_AFFILIATION,
    PdfFormFields.POSITION_TITLE,
  ];

  const applicantData = signerFields.map((field: any) => ({
    fieldName: field.fieldName,
    fieldValue: data?.sections.applicant.info[field.fieldKey],
  }));

  const representativeData = signerFields.map((field) => ({
    fieldName: field.fieldName,
    fieldValue: data?.sections.representative.info[field.fieldKey],
  }));

  const dacoData = ['Name', 'Title', 'Date of Approval'].map((fieldName: string) => ({
    fieldName,
    fieldValue: '',
  }));

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
      <View
        style={{
          borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
          marginTop: '15pt',
          marginBottom: '15pt',
          paddingTop: '5pt',
        }}
      >
        <SectionTitle>APPLICANT AUTHORIZATION</SectionTitle>
        <VerticalTable style={styles.table} useInternalBorders data={applicantData} />
        <Signature />
      </View>
      <View
        style={{
          borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
          marginTop: '15pt',
          marginBottom: '25pt',
          paddingTop: '5pt',
        }}
      >
        <SectionTitle>INSTITUTIONAL REPRESENTATIVE AUTHORIZATION</SectionTitle>
        <VerticalTable style={styles.table} useInternalBorders data={representativeData} />
        <Signature />
      </View>
      <View
        style={{ border: `2pt solid ${defaultTheme.colors.black}`, padding: '10pt' }}
        wrap={false}
      >
        <PDFParagraph style={{ ...commonStyles.highlighted, fontWeight: 'semibold' }}>
          Reserved for the ICGC Data Access Compliance Office (ICGC DACO)
        </PDFParagraph>
        <VerticalTable useInternalBorders data={dacoData} style={styles.table} />
        <Signature />
      </View>
    </PDFLayout>
  );
};

export default Signatures;
