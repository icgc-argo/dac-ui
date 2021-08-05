import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import { CONTROLLED_DATA_USERS_PAGE } from 'global/constants';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import {
  getStaticComponents,
  PdfFormFields,
  PDFParagraph,
  PDFTextArea,
  SectionTitle,
  styles,
} from './common';
import FORM_TEXT from './textConstants';
import { View } from '@react-pdf/renderer';
import VerticalTable, { DataCell } from './VerticalTable';
import { FieldAccessor, PdfFieldName } from './types';
import { ApplicationData, ApplicationDataByField } from '../types';

const MIN_PUBLICATION_FIELDS = 3;

const BasicInfo = ({ data }: { data?: Partial<ApplicationDataByField> }) => {
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
        data={
          infoFields.map((field) => ({
            fieldName: field.fieldName,
            fieldValue: data ? data[field.fieldKey] : '',
          })) as DataCell[]
        }
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
          If you are planning on combining ICGC controlled data with other datasets, you agree not
          to link or combine the ICGC Controlled Data to other data available in a way that could
          re-identify the donors.{' '}
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

const PdfPublicationsFormData = ({ data = [] }: { data?: string[] }) => {
  const pubData = data.map((d: string) => ({
    fieldName: PdfFieldName.PUBLICATION_URL,
    fieldValue: d,
  }));
  // pdf is required to show a minimum of 3 publication fields, so appending empty rows if less than 3 publications have been added
  while (pubData.length < MIN_PUBLICATION_FIELDS) {
    pubData.push({
      fieldName: PdfFieldName.PUBLICATION_URL,
      fieldValue: '',
    });
  }
  return (
    <View>
      <StaticPublications isPdf />
      <VerticalTable data={pubData} />
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
        marginTop: '5pt',
        marginBottom: '10pt',
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
        paddingTop: '5pt',
        marginTop: '5pt',
        marginBottom: '15pt',
      }}
    >
      <SectionTitle>PROJECT LAY SUMMARY</SectionTitle>

      <TextComponent>
        The lay summaries of ICGC DACO approved projects are posted on the{' '}
        <LinkComponent href={CONTROLLED_DATA_USERS_PAGE} rel="noopener noreferrer" target="_blank">
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
        paddingTop: '5pt',
        marginTop: '5pt',
        marginBottom: '15pt',
      }}
    >
      <SectionTitle>RELEVANT PUBLICATIONS</SectionTitle>

      <TextComponent>
        <TextComponent as="span" bold>
          Please provide at least three links to relevant publications
        </TextComponent>
        , of which the applicant is an author or a co-author. These should be links (URLs) to
        publication websites such as{' '}
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
          <PDFTextArea>{data?.sections.projectInfo[FieldAccessor.BACKGROUND]}</PDFTextArea>
          <PDFParagraph style={{ fontWeight: 600 }}>
            {FORM_TEXT.project_info.inputLabel.aims}
          </PDFParagraph>
          <AimsBubble isPdf />
          <PDFTextArea>{data?.sections.projectInfo[FieldAccessor.AIMS]}</PDFTextArea>
          <PDFParagraph style={{ fontWeight: 600 }}>
            {FORM_TEXT.project_info.inputLabel.dataUse}
          </PDFParagraph>
          <DataUseBubble isPdf />
          <PDFTextArea>{data?.sections.projectInfo[FieldAccessor.METHODOLOGY]}</PDFTextArea>
          <StaticLaySummary isPdf />
          <PDFParagraph style={{ fontWeight: 600 }}>
            {FORM_TEXT.project_info.inputLabel.laySummary}
          </PDFParagraph>
          <LaySummaryBubble isPdf />
          <PDFTextArea>{data?.sections.projectInfo[FieldAccessor.SUMMARY]}</PDFTextArea>
          <PdfPublicationsFormData
            data={data?.sections.projectInfo[FieldAccessor.PUBLICATIONS_URL] as string[]}
          />
        </View>
      )}
    </ContainerComponent>
  );
};

export default StaticProjectInfo;
