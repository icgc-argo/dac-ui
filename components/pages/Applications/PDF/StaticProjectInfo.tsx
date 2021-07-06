import React, { ReactNode } from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import {
  getStaticComponents,
  PdfFormFields,
  PDFParagraph,
  PDFText,
  PDFTextArea,
  Section,
  SectionTitle,
  styles,
} from './common';
import FORM_TEXT from './textConstants';
import { Text, View } from '@react-pdf/renderer';
import VerticalTable from './VerticalTable';
import { PdfFieldName } from './types';
import { ApplicationData } from '../types';

const BasicInfo = ({ data }: { data: any }) => {
  const infoFields = [PdfFormFields.PROJECT_TITLE, PdfFormFields.PROJECT_WEBSITE];
  return (
    <View
      style={{
        borderTop: `1px solid ${defaultTheme.colors.grey_1}`,
        paddingTop: '5pt',
        margin: '10pt 0 30pt',
      }}
    >
      <SectionTitle>{FORM_TEXT.project_info.basic_info}</SectionTitle>
      <VerticalTable
        data={infoFields.map((field) => ({
          fieldName: field.fieldName,
          fieldValue: data[field.fieldKey],
        }))}
      />
    </View>
  );
};

export const BackgroundBubble = ({ isPdf = false }: { isPdf?: boolean }) => {
  const {
    UnorderedListComponent,
    ListComponent,
    GenericContainer,
    TextComponent,
  } = getStaticComponents(isPdf);

  return (
    <GenericContainer style={styles.bubbleContainer} wrap={false}>
      <TextComponent as="span" style={{ margin: 0 }}>
        Provide a short summary of the background basis of your research. For example,
      </TextComponent>
      <UnorderedListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          What founding research is your project based on?
        </ListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          If possible, include any previous research in this area that you have completed that is
          relevant.
        </ListComponent>
      </UnorderedListComponent>
    </GenericContainer>
  );
};

export const AimsBubble = ({ isPdf = false }: { isPdf?: boolean }) => {
  const {
    UnorderedListComponent,
    ListComponent,
    GenericContainer,
    TextComponent,
  } = getStaticComponents(isPdf);

  return (
    <GenericContainer style={styles.bubbleContainer} wrap={false}>
      <TextComponent as="span" style={{ margin: 0 }}>
        Provide a summary of what your project hopes to achieve using the ICGC Controlled Data. For
        example:
      </TextComponent>
      <UnorderedListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          How will your research impact health research or biological understanding?
        </ListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          What are some planned outputs for your research project?
        </ListComponent>
      </UnorderedListComponent>
    </GenericContainer>
  );
};

export const DataUseBubble = ({ isPdf = false }: { isPdf?: boolean }) => {
  const {
    UnorderedListComponent,
    ListComponent,
    GenericContainer,
    TextComponent,
    LinkComponent,
  } = getStaticComponents(isPdf);
  return (
    <GenericContainer style={styles.bubbleContainer} wrap={false}>
      <TextComponent as="span" style={{ margin: 0 }}>
        Provide a summary of the methods for your research project and the plans for data usage,
        including:
      </TextComponent>
      <UnorderedListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          What major methods and technologies will you use (in-depth methodology is not required)?
        </ListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          How exactly will the ICGC Controlled Data be used?
        </ListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          <TextComponent as="span" bold style={{ fontWeight: 600 }}>
            Please note:
          </TextComponent>{' '}
          If you are planning on combining ICGC controlled data with other datasets, as per{' '}
          <LinkComponent href="#" rel="noopener noreferrer" target="_blank">
            Term 5 of the Data Access Agreement (DAA)
          </LinkComponent>
          , you agree not to link or combine the ICGC Controlled Data to other data available in a
          way that could re-identify the Research Participants.{' '}
          <TextComponent as="span" bold style={{ fontWeight: 600 }}>
            Please confirm how the methods you intend to use to combine datasets will minimize the
            risk for re-identification of the ICGC data donors
          </TextComponent>
          <TextComponent as="span" style={{ margin: 0 }}>
            .
          </TextComponent>
        </ListComponent>
      </UnorderedListComponent>
    </GenericContainer>
  );
};

export const LaySummaryBubble = ({ isPdf = false }: { isPdf?: boolean }) => {
  const {
    UnorderedListComponent,
    ListComponent,
    GenericContainer,
    TextComponent,
  } = getStaticComponents(isPdf);
  return (
    <GenericContainer style={styles.bubbleContainer} wrap={false}>
      <TextComponent as="span" style={{ margin: 0 }}>
        Provide a short project summary targeted towards the general public, including ICGC data
        donors.
      </TextComponent>
      <UnorderedListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          Describe your project as if you were describing to a friend who is not an expert.
        </ListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          Scientific terminology such as "germline," "non-coding regions," "somatic," and
          "whole-genome/whole-exome/next-generation sequencing" should therefore be described or
          defined in lay terms.
        </ListComponent>
        <ListComponent asListItem style={{ width: '95%' }}>
          In addition to explaining the background and objectives of your research project,{' '}
          <TextComponent as="span" bold>
            please clearly explain how the ICGC Controlled Data will be used
          </TextComponent>
          <TextComponent as="span" style={{ margin: 0 }}>
            .
          </TextComponent>
        </ListComponent>
      </UnorderedListComponent>
    </GenericContainer>
  );
};

const PdfPublicationsFormData = ({ data }: { data: any }) => {
  return (
    <View>
      <StaticPublications isPdf />
      <VerticalTable
        data={data.map((d: string) => ({
          fieldName: PdfFieldName.PUBLICATION_URL,
          fieldValue: d,
        }))}
      />
    </View>
  );
};

export const StaticResearchSummary = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { SectionTitle, SectionComponent, TextComponent } = getStaticComponents(isPdf);
  return (
    <SectionComponent
      style={{
        borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
        paddingTop: '5pt',
      }}
    >
      <SectionTitle>RESEARCH SUMMARY - SCIENTIFIC ABSTRACT</SectionTitle>

      <TextComponent>
        This section should describe the{' '}
        <TextComponent as="span" bold style={{ fontWeight: 600 }}>
          background, aims, and methodology
        </TextComponent>{' '}
        of your research project, as well as plans for{' '}
        <TextComponent as="span" bold style={{ fontWeight: 600 }}>
          how you will use the ICGC Controlled Data.
        </TextComponent>
      </TextComponent>
    </SectionComponent>
  );
};

export const StaticLaySummary = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { SectionComponent, TextComponent, SectionTitle, LinkComponent } = getStaticComponents(
    isPdf,
  );
  return (
    <SectionComponent
      style={{
        borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
        marginTop: '20pt',
        marginBottom: '15pt',
      }}
    >
      <SectionTitle>PROJECT LAY SUMMARY</SectionTitle>

      <TextComponent>
        The lay summaries of ICGC DACO approved projects are posted on the{' '}
        <LinkComponent href="#" rel="noopener noreferrer" target="_blank">
          ICGC ARGO website
        </LinkComponent>
        <TextComponent as="span" style={{ margin: 0 }}>
          .
        </TextComponent>
      </TextComponent>
    </SectionComponent>
  );
};

export const StaticPublications = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { SectionComponent, TextComponent, SectionTitle, LinkComponent } = getStaticComponents(
    isPdf,
  );

  return (
    <SectionComponent
      style={{
        borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
        marginTop: '20pt',
        marginBottom: '15pt',
      }}
    >
      <SectionTitle>RELEVANT PUBLICATIONS</SectionTitle>

      <TextComponent>
        <TextComponent as="span" bold>
          Please provide at least three links to relevant publications
        </TextComponent>
        , of which you, the applicant, were an author or a co-author. These should be links (URLs)
        to publication websites such as{' '}
        <LinkComponent href="https://pubmed.gov" rel="noopener noreferrer" target="_blank">
          pubmed.gov
        </LinkComponent>
        ,{' '}
        <LinkComponent href="https://biorxiv.org" rel="noopener noreferrer" target="_blank">
          biorxiv.org
        </LinkComponent>
        , or{' '}
        <LinkComponent href="https://medrxiv.org" rel="noopener noreferrer" target="_blank">
          medrxiv.org
        </LinkComponent>
        <TextComponent as="span" style={{ margin: 0 }}>
          .
        </TextComponent>
      </TextComponent>
    </SectionComponent>
  );
};
const StaticProjectInfo = ({
  isPdf = false,
  data,
}: {
  isPdf?: boolean;
  data?: ApplicationData;
}) => {
  const {
    ContainerComponent,
    SectionComponent,
    TextComponent,
    TitleComponent,
  } = getStaticComponents(isPdf);

  // TODO: need to add text for textareas from data
  return (
    <ContainerComponent
      appId={data?.appId}
      state={data?.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent>D. Project Information</TitleComponent>

      <SectionComponent>
        <TextComponent>
          Please fill out the following details for your research project, including the website url
          if available.
        </TextComponent>

        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>
      {isPdf && (
        <View>
          <BasicInfo data={data?.sections.projectInfo} />
          <StaticResearchSummary isPdf={isPdf} />
          <PDFParagraph style={{ fontWeight: 600 }} wrap>
            {FORM_TEXT.project_info.inputLabel.background}
          </PDFParagraph>
          <BackgroundBubble isPdf />
          <PDFTextArea>{data?.sections.projectInfo.background}</PDFTextArea>
          <PDFParagraph style={{ fontWeight: 600 }}>
            {FORM_TEXT.project_info.inputLabel.aims}
          </PDFParagraph>
          <AimsBubble isPdf />
          <PDFTextArea>{data?.sections.projectInfo.aims}</PDFTextArea>
          <PDFParagraph style={{ fontWeight: 600 }}>
            {FORM_TEXT.project_info.inputLabel.dataUse}
          </PDFParagraph>
          <DataUseBubble isPdf />
          <PDFTextArea>{data?.sections.projectInfo.methodology}</PDFTextArea>
          <StaticLaySummary isPdf />
          <PDFParagraph style={{ fontWeight: 600 }}>
            {FORM_TEXT.project_info.inputLabel.laySummary}
          </PDFParagraph>
          <LaySummaryBubble isPdf />
          {/* TODO: add lay summary from data */}
          <PDFTextArea>{'Lay summary data not available'}</PDFTextArea>
          <PdfPublicationsFormData data={data?.sections.projectInfo.publicationsURLs} />
        </View>
      )}
    </ContainerComponent>
  );
};

export default StaticProjectInfo;