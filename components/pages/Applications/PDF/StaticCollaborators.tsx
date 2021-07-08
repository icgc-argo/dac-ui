import React from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import {
  getFieldValue,
  getStaticComponents,
  PdfFormFields,
  PDFParagraph,
  SectionTitle,
} from './common';
import FORM_TEXT from './textConstants';
import { View } from '@react-pdf/renderer';
import VerticalTable from './VerticalTable';
import { ApplicationData, CollaboratorType } from '../types';

const personnelFields = [
  PdfFormFields.NAME,
  PdfFormFields.PRIMARY_AFFILIATION,
  PdfFormFields.INSTITUTIONAL_EMAIL,
  PdfFormFields.GOOGLE_EMAIL,
  PdfFormFields.POSITION_TITLE,
];

const studentFields = [
  PdfFormFields.NAME,
  PdfFormFields.PRIMARY_AFFILIATION,
  PdfFormFields.INSTITUTIONAL_EMAIL,
  PdfFormFields.GOOGLE_EMAIL,
  PdfFormFields.PURSUING_DEGREE, // api data shows `positionTitle`, not sure if this is the same thing
];

const PdfCollaboratorsFormData = ({ data }: { data?: ApplicationData }) => {
  const students = data?.sections.collaborators.list.filter(
    (collaborator: any) => collaborator.type === CollaboratorType.STUDENT,
  );
  const personnel = data?.sections.collaborators.list.filter(
    (collaborator: any) => collaborator.type === CollaboratorType.PERSONNEL,
  );

  return (
    <View>
      <View style={{ borderTop: `1px solid ${defaultTheme.colors.grey_1}`, paddingTop: '5px' }}>
        <SectionTitle>
          {FORM_TEXT.collaborators.personnel.title} ({personnel?.length})
        </SectionTitle>
        {personnel?.length ? (
          personnel.map((person: any) => (
            <View key={person.id} style={{ marginTop: '15pt' }} wrap={false}>
              <VerticalTable
                key={person.id}
                data={personnelFields.map((field) => ({
                  fieldName: field.fieldName,
                  fieldValue: getFieldValue(person.info, field.fieldKey),
                }))}
                useExternalBorders
              />
            </View>
          ))
        ) : (
          <PDFParagraph>
            You have not added any Authorized Personnel to your application.
          </PDFParagraph>
        )}
      </View>
      <View
        style={{
          borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
          marginTop: '25pt',
          paddingTop: '5pt',
        }}
      >
        <SectionTitle>
          {FORM_TEXT.collaborators.students.title} ({students?.length})
        </SectionTitle>
        {students?.length ? (
          students.map((student: any) => {
            return (
              <View key={student.id} style={{ marginTop: '15pt' }} wrap={false}>
                <VerticalTable
                  data={studentFields.map((field) => ({
                    fieldName: field.fieldName,
                    fieldValue: getFieldValue(student.info, field.fieldKey),
                  }))}
                  useExternalBorders
                />
              </View>
            );
          })
        ) : (
          <PDFParagraph>
            You have not added any Authorized Students to your application.
          </PDFParagraph>
        )}
      </View>
    </View>
  );
};
const StaticCollaborators = ({
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
      <TitleComponent>C. Collaborators</TitleComponent>

      <SectionComponent>
        <TextComponent style={{ marginBottom: isPdf ? '20pt' : '43px' }}>
          Please include the names of all{' '}
          <TextComponent as="span" bold style={{ fontWeight: 600 }}>
            investigators, collaborators, research staff (including post-docs) and students
            (including graduate students),
          </TextComponent>{' '}
          who will have access to the ICGC Controlled Data in order to work on the project (see
          "Research Project" under Section D).
        </TextComponent>
        <TextComponent>
          * Please note: Co-investigators, collaborators or students at other institutions should
          not be included in this list. They will have to submit a separate Application for
          Controlled Data Access.
        </TextComponent>
      </SectionComponent>
      {isPdf && <PdfCollaboratorsFormData data={data} />}
    </ContainerComponent>
  );
};

export default StaticCollaborators;
