import React, { ReactNode } from 'react';
import { Text, View, Font, StyleSheet, Svg } from '@react-pdf/renderer';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';
import Typography from '@icgc-argo/uikit/Typography';
import Link from '@icgc-argo/uikit/Link';

import PDFLayout from './PdfLayout';
import EmptyCheckbox from './icons/EmptyCheckbox';
import FilledCheckbox from './icons/FilledCheckbox';
import { FieldAccessor, PdfFieldName, PdfFormField } from './types';

const WorkSansBold = require('public/fonts/WorkSans-Bold.ttf').default;
const WorkSansLight = require('public/fonts/WorkSans-Light.ttf').default;
const WorkSansRegular = require('public/fonts/WorkSans-Regular.ttf').default;
const WorkSansSemiBold = require('public/fonts/WorkSans-SemiBold.ttf').default;

Font.register({
  family: 'WorkSans',
  fonts: [
    { src: WorkSansRegular, fontWeight: 'normal', fontStyle: 'normal' },
    { src: WorkSansSemiBold, fontWeight: 'semibold', fontStyle: 'normal' },
    { src: WorkSansLight, fontWeight: 'light', fontStyle: 'normal' },
    { src: WorkSansBold, fontWeight: 'bold', fontStyle: 'normal' },
  ],
});

// disable hyphenation
Font.registerHyphenationCallback((word) => [word]);

export const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flex: 1,
    padding: '15px 10px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontFamily: 'WorkSans',
    fontWeight: 'semibold',
    fontSize: '24px',
    lineHeight: 1.4,
  },
  text: {
    fontFamily: 'WorkSans',
    fontSize: '11px',
    fontWeight: 'normal',
    lineHeight: 1.7,
  },
  paragraph: {
    marginBottom: 10,
  },
  link: {
    color: defaultTheme.colors.accent2_dark,
  },
  sectionTitle: {
    fontFamily: 'WorkSans',
    color: defaultTheme.colors.secondary,
    fontSize: '14px',
    fontWeight: 'semibold',
    lineHeight: 1.4,
    margin: '10px 0',
  },
});

// react-pdf components
export const PDFTitle = ({ children, style }: { children: ReactNode; style?: any }) => {
  return <Text style={{ ...styles.title, ...style }}>{children}</Text>;
};

export const PDFParagraph = ({ children, style }: { children: ReactNode; style?: any }) => {
  return (
    <Text wrap={false} style={{ ...styles.text, ...styles.paragraph, ...style }}>
      {children}
    </Text>
  );
};

export const StyledView = ({ children, style }: { children: ReactNode; style?: any }) => {
  return <View style={{ ...styles.section, ...style }}>{children}</View>;
};

export const PDFLink = ({ children, style }: { children: ReactNode; style?: any }) => {
  return <Text style={{ ...styles.paragraph, ...styles.link, ...style }}>{children}</Text>;
};

export const SectionTitle = ({ children, style }: { children: ReactNode; style?: any }) => {
  return <Text style={{ ...styles.sectionTitle, ...style }}>{children}</Text>;
};

export const Checkbox = ({ TextComponent, checked }: { TextComponent: any; checked: boolean }) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      {checked ? <FilledCheckbox /> : <EmptyCheckbox />}
      <PDFParagraph style={{ marginLeft: '5px', marginTop: '2px' }}>{TextComponent}</PDFParagraph>
    </View>
  );
};

// ui components
export const Section = ({ children }: { children: ReactNode }) => <section>{children}</section>;

// need to use element other than React.Fragment so props can be passed
export const ContainerDiv = ({ children }: { children: ReactNode }) => <div>{children}</div>;

export const UITitle = ({ children }: { children: ReactNode }) => (
  <Typography bold component="h2">
    {children}
  </Typography>
);

export const getStaticComponents = (isPdf: boolean) => {
  return isPdf
    ? {
        TextComponent: PDFParagraph,
        TitleComponent: PDFTitle,
        LinkComponent: PDFLink,
        SectionComponent: View,
        ContainerComponent: PDFLayout,
      }
    : {
        TextComponent: Typography,
        TitleComponent: UITitle,
        LinkComponent: Link,
        SectionComponent: Section,
        ContainerComponent: ContainerDiv,
      };
};

export const PdfFormFields: PdfFormField = {
  [PdfFieldName.NAME]: { fieldName: 'Name', fieldKey: FieldAccessor.DISPLAY_NAME },
  [PdfFieldName.PRIMARY_AFFILIATION]: {
    fieldName: 'Primary Affiliation',
    fieldKey: FieldAccessor.PRIMARY_AFFILIATION,
  },
  [PdfFieldName.INSTITUTIONAL_EMAIL]: {
    fieldName: 'Institutional Email',
    fieldKey: FieldAccessor.INSTITUTIONAL_EMAIL,
  },
  [PdfFieldName.GOOGLE_EMAIL]: { fieldName: 'Google Email', fieldKey: FieldAccessor.GOOGLE_EMAIL },
  [PdfFieldName.RESEARCHER_PROFILE_URL]: {
    fieldName: 'Researcher Profile URL',
    fieldKey: FieldAccessor.RESEARCHER_PROFILE_URL,
  },
  [PdfFieldName.POSITION_TITLE]: {
    fieldName: 'Position Title',
    fieldKey: FieldAccessor.POSITION_TITLE,
  },
  [PdfFieldName.PURSUING_DEGREE]: {
    fieldName: 'Pursuing Degree',
    fieldKey: FieldAccessor.POSITION_TITLE,
  },
};

// make this better, and reuse for applicant address
export const getStreetAddress = (street: string, building: string) => {
  let streetAddress = [];
  street?.length && streetAddress.push(street);
  building?.length && streetAddress.push(building);
  return streetAddress.join(', ');
};
