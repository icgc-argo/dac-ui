import React, { ReactNode } from 'react';
import { Text, View, Font, StyleSheet, Svg } from '@react-pdf/renderer';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';
import Typography from '@icgc-argo/uikit/Typography';
import Link from '@icgc-argo/uikit/Link';

import PDFLayout from './PdfLayout';
import EmptyCheckbox from './icons/EmptyCheckbox';
import FilledCheckbox from './icons/FilledCheckbox';
import { FieldAccessor, PdfField, PdfFieldName, PdfFormField } from './types';
import Banner from '@icgc-argo/uikit/notifications/Banner';
import { css } from '@icgc-argo/uikit';

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
    padding: '15pt 10pt',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontFamily: 'WorkSans',
    fontWeight: 'semibold',
    fontSize: 20,
    lineHeight: 1.4,
    marginBottom: '15pt',
  },
  text: {
    fontFamily: 'WorkSans',
    fontSize: 11,
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
    fontSize: 14,
    fontWeight: 'semibold',
    lineHeight: 1.4,
    margin: '10pt 0',
  },
  banner: {
    border: `1pt solid ${defaultTheme.colors.accent2}`,
    padding: '7pt 9pt',
    borderRadius: '8pt',
    marginBottom: '25pt',
  },
  highlighted: {
    color: defaultTheme.colors.secondary,
  },
  bubbleContainer: {
    border: `1px solid ${defaultTheme.colors.grey_1}`,
    padding: '10pt 5pt',
    marginBottom: '10pt',
  },
  textArea: {
    margin: '5pt 5pt 15pt 0',
  },
});

// react-pdf components
export const PDFTitle = ({ children, style = {} }: { children: ReactNode; style?: any }) => {
  return <Text style={{ ...styles.title, ...style }}>{children}</Text>;
};

export const PDFText = ({
  children,
  style = {},
  asListItem = false,
  count,
}: {
  children: ReactNode;
  style?: any;
  asListItem?: boolean;
  count?: number;
}) => (
  <View>
    <View style={{ display: 'flex', flexDirection: 'row' }} wrap={false}>
      {count && (
        <Text style={styles.text}>
          {count}.{'  '}
        </Text>
      )}
      {asListItem && <Text style={{ fontSize: 11 }}>{'•  '}</Text>}
      <Text
        style={{
          ...styles.text,
          ...(count && styles.paragraph),
          ...style,
        }}
      >
        {children}
      </Text>
    </View>
  </View>
);

export const PDFParagraph = ({
  children,
  style = {},
  wrap = false,
}: {
  children: ReactNode;
  style?: any;
  wrap?: boolean;
}) => {
  return (
    <Text wrap={wrap} style={{ ...styles.text, ...styles.paragraph, ...style }}>
      {children}
    </Text>
  );
};

export const StyledView = ({ children, style = {} }: { children: ReactNode; style?: any }) => {
  return <View style={{ ...styles.section, ...style }}>{children}</View>;
};

export const PDFLink = ({
  children,
  href,
  style = {},
}: {
  children: ReactNode;
  href?: string;
  style?: any;
}) => {
  return (
    <Text style={{ ...styles.paragraph, ...styles.link, ...style }}>
      {children} {href && `(${href})`}
    </Text>
  );
};

export const SectionTitle = ({ children, style = {} }: { children: ReactNode; style?: any }) => {
  return <Text style={{ ...styles.sectionTitle, ...style }}>{children}</Text>;
};

export const Checkbox = ({
  TextComponent,
  checked,
  style = {},
}: {
  TextComponent: any;
  checked: boolean;
  style?: any;
}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        border: `1pt solid ${defaultTheme.colors.grey_1}`,
        padding: '4pt 4pt 0pt 4pt',
        ...style,
      }}
    >
      {checked ? <FilledCheckbox /> : <EmptyCheckbox />}
      <PDFText style={{ marginLeft: '10pt', width: '95%' }}>{TextComponent}</PDFText>
    </View>
  );
};

export const PDFTextArea = ({ children }: { children: ReactNode }) => {
  return <Text style={{ ...styles.text, ...styles.textArea }}>{children}</Text>;
};

export const PDFBanner = ({ content }: { content: ReactNode }) => {
  return <View style={styles.banner}>{content}</View>;
};

// ui components
export const Section = ({ children }: { children: ReactNode }) => <section>{children}</section>;

export const Li = ({ children }: { children: ReactNode }) => <li>{children}</li>;
export const Ul = ({ children }: { children: ReactNode }) => <ul>{children}</ul>;
const Ol = ({ children }: { children: ReactNode }) => {
  return (
    <Typography
      component="ol"
      css={css`
        font-size: 13px;
        margin-left: -10px;
        padding-left: 25px;

        li {
          padding: 10px;

          &:nth-of-type(even) {
            background: ${defaultTheme.colors.grey_4};
          }
        }
      `}
    >
      {children}
    </Typography>
  );
};

export const UITitle = ({ children }: { children: ReactNode }) => (
  <Typography bold component="h2">
    {children}
  </Typography>
);

export const UISectionTitle = ({ children }: { children: ReactNode }) => {
  return (
    <Typography bold component="h3" color="secondary">
      {children}
    </Typography>
  );
};

export const getStaticComponents = (isPdf: boolean) => {
  return isPdf
    ? {
        TextComponent: PDFParagraph,
        TitleComponent: PDFTitle,
        LinkComponent: PDFLink,
        SectionComponent: View,
        ContainerComponent: PDFLayout,
        SectionTitle,
        UnorderedListComponent: View,
        OrderedListComponent: View,
        ListComponent: PDFText,
        GenericContainer: View,
        BannerComponent: PDFBanner,
      }
    : {
        TextComponent: Typography,
        TitleComponent: UITitle,
        LinkComponent: Link,
        SectionComponent: Section,
        ContainerComponent: Section,
        SectionTitle: UISectionTitle,
        UnorderedListComponent: Ul,
        OrderedListComponent: Ol,
        ListComponent: Li,
        GenericContainer: React.Fragment,
        BannerComponent: Banner,
      };
};

export const PdfFormFields: PdfFormField = {
  [PdfField.NAME]: { fieldName: PdfFieldName.NAME, fieldKey: FieldAccessor.DISPLAY_NAME },
  [PdfField.PRIMARY_AFFILIATION]: {
    fieldName: PdfFieldName.PRIMARY_AFFILIATION,
    fieldKey: FieldAccessor.PRIMARY_AFFILIATION,
  },
  [PdfField.INSTITUTIONAL_EMAIL]: {
    fieldName: PdfFieldName.INSTITUTIONAL_EMAIL,
    fieldKey: FieldAccessor.INSTITUTIONAL_EMAIL,
  },
  [PdfField.GOOGLE_EMAIL]: {
    fieldName: PdfFieldName.GOOGLE_EMAIL,
    fieldKey: FieldAccessor.GOOGLE_EMAIL,
  },
  [PdfField.RESEARCHER_PROFILE_URL]: {
    fieldName: PdfFieldName.RESEARCHER_PROFILE_URL,
    fieldKey: FieldAccessor.RESEARCHER_PROFILE_URL,
  },
  [PdfField.POSITION_TITLE]: {
    fieldName: PdfFieldName.POSITION_TITLE,
    fieldKey: FieldAccessor.POSITION_TITLE,
  },
  [PdfField.PURSUING_DEGREE]: {
    fieldName: PdfFieldName.PURSUING_DEGREE,
    fieldKey: FieldAccessor.POSITION_TITLE,
  },
  [PdfField.PROJECT_TITLE]: {
    fieldName: PdfFieldName.PROJECT_TITLE,
    fieldKey: FieldAccessor.PROJECT_TITLE,
  },
  [PdfField.PROJECT_WEBSITE]: {
    fieldName: PdfFieldName.PROJECT_WEBSITE,
    fieldKey: FieldAccessor.PROJECT_WEBSITE,
  },
};

export const getStreetAddress = (street: string, building: string) => {
  let streetAddress = [];
  street?.length && streetAddress.push(street);
  building?.length && streetAddress.push(building);
  return streetAddress.join(', ');
};
