import React from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import {
  getFieldValue,
  getStaticComponents,
  getStreetAddress,
  PdfFormFields,
  SectionTitle,
} from './common';
import FORM_TEXT from './textConstants';
import { View } from '@react-pdf/renderer';
import VerticalTable from './VerticalTable';
import { ApplicationData } from '../types';

const PdfRepFormData = ({ data }: { data?: ApplicationData }) => {
  const repFields = [
    PdfFormFields.NAME,
    PdfFormFields.PRIMARY_AFFILIATION,
    PdfFormFields.INSTITUTIONAL_EMAIL,
    PdfFormFields.POSITION_TITLE,
  ];

  const address = data?.sections.representative.addressSameAsApplicant
    ? data.sections.applicant.address
    : data?.sections.representative.address;

  // there may be a nicer way to handle the mailing address, but not going to worry about it right now
  // it's only used in 2 places
  const addressData = [
    {
      fieldName: 'Mailing Address',
      fieldValue: getStreetAddress(address?.streetAddress, address?.building),
    },
    {
      fieldValue: address?.cityAndProvince,
    },
    {
      fieldValue: address?.country,
    },
    { fieldValue: address?.postalCode },
  ];

  return (
    <View>
      <View style={{ borderTop: `1pt solid ${defaultTheme.colors.grey_1}`, paddingTop: '5pt' }}>
        <SectionTitle>{FORM_TEXT.representative.title}</SectionTitle>
        <VerticalTable
          data={repFields.map((field) => ({
            fieldName: field.fieldName,
            fieldValue: getFieldValue(data?.sections.representative.info, field.fieldKey),
          }))}
        />
      </View>
      <View
        style={{
          borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
          marginTop: '25pt',
          paddingTop: '5pt',
        }}
      >
        <SectionTitle>{FORM_TEXT.representative.address}</SectionTitle>
        <VerticalTable data={addressData} useInternalBorders={false} />
      </View>
    </View>
  );
};

const StaticRepresentative = ({
  isPdf = false,
  data,
}: {
  isPdf?: boolean;
  data?: ApplicationData;
}) => {
  const {
    TextComponent,
    TitleComponent,
    SectionComponent,
    ContainerComponent,
    LinkComponent,
  } = getStaticComponents(isPdf);

  return (
    <ContainerComponent
      appId={data?.appId}
      state={data?.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent>B. Institutional Representative</TitleComponent>
      <SectionComponent>
        <TextComponent>
          An Institutional Representative is a qualified representative of a legal entity{' '}
          <TextComponent as="span" bold style={{ fontWeight: 600 }}>
            who has the administrative power to legally commit that entity to the terms and
            conditions in Section F: Data Access Agreement
          </TextComponent>{' '}
          (e.g. Vice-President Research, a Research Director, or a Contracts Officer for the
          entity).
        </TextComponent>

        <TextComponent>
          The Institutional Representative’s signature will be required at the end of this
          application before being reviewed by ICGC DACO.
        </TextComponent>
        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>
      {isPdf && <PdfRepFormData data={data} />}
    </ContainerComponent>
  );
};

export default StaticRepresentative;
