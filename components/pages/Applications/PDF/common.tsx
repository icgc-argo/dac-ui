import { Text, View, Font, StyleSheet, Svg } from '@react-pdf/renderer';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';
import Typography from '@icgc-argo/uikit/Typography';

import { ReactNode } from 'react';
import React from 'react';
import PDFLayout from './PdfLayout';
import Link from '@icgc-argo/uikit/Link';
import PDFIcgcDaco from './icons/PDFIcgcDaco';
import EmptyCheckbox from './icons/EmptyCheckbox';
import FilledCheckbox from './icons/FilledCheckbox';

// for some reason the fonts do not display properly on a hard reload, but the pdf download is fine. which in the end is good enough
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
    lineHeight: 1.7,
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
        ContainerComponent: React.Fragment,
      };
};
