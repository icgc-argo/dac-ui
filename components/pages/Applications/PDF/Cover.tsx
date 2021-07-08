import React from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import { View, Text, StyleSheet } from '@react-pdf/renderer';
import PDFLayout from './PdfLayout';
import PDFIcgcDaco from './icons/PdfIcgcDaco';
import { getDisplayName, PDFText, PDFTitle } from './common';
import VerticalTable from './VerticalTable';
import { ApplicationData } from '../types';
import { getFormattedDate } from '../Dashboard/Applications/InProgress/helpers';
import { TIME_DAY_AND_DATE_FORMAT } from '../Dashboard/Applications/InProgress/constants';
import { FieldAccessor } from './types';

const styles = StyleSheet.create({
  tableValue: {
    color: defaultTheme.colors.secondary,
    fontWeight: 'semibold',
  },
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: '50pt',
  },
  subtitle: {
    marginTop: '20pt',
  },
  table: {
    padding: '10pt 5pt 10pt 5pt',
    width: '460pt',
  },
});

const Cover = ({ data }: { data?: ApplicationData }) => {
  const piData = [
    {
      fieldName: 'Daco Application #',
      fieldValue: <Text style={styles.tableValue}>{data?.appId}</Text>,
    },
    {
      fieldName: 'Principal Investigator',
      fieldValue: (
        <Text style={styles.tableValue}>{getDisplayName(data?.sections.applicant.info)}</Text>
      ),
    },
    {
      fieldName: 'Institution',
      fieldValue: (
        <Text style={styles.tableValue}>
          {data?.sections.applicant.info[FieldAccessor.PRIMARY_AFFILIATION]}
        </Text>
      ),
    },
    {
      fieldName: 'Document rendered on',
      fieldValue: (
        <Text style={styles.tableValue}>
          {getFormattedDate(Date.now(), TIME_DAY_AND_DATE_FORMAT)}
        </Text>
      ),
    },
  ];

  return (
    <PDFLayout appId={data?.appId} state={data?.state} applicant={data?.sections?.applicant.info}>
      <View style={styles.container}>
        <PDFIcgcDaco />
        <PDFText style={styles.subtitle}>ICGC DATA ACCESS COMPLIANCE OFFICE</PDFText>
        <PDFTitle style={styles.title}>Application for Access to ICGC Controlled Data</PDFTitle>
        <VerticalTable
          style={styles.table}
          headerCellWidth={40}
          useExternalBorders
          useInternalBorders={false}
          data={piData}
        />
      </View>
    </PDFLayout>
  );
};

export default Cover;
