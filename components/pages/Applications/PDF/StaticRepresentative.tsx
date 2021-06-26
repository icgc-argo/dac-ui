import React from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { getStaticComponents, getStreetAddress, PdfFormFields, SectionTitle } from './common';
import FORM_TEXT from './textConstants';
import { View } from '@react-pdf/renderer';
import VerticalTable from './VerticalTable';

// for testing empty address fields display
const emptyRepData = {
  address: {
    building: '',
    cityAndProvince: 'Toronto',
    country: '',
    postalCode: 'POSTALCODE',
    streetAddress: '',
  },
  addressSameAsApplicant: true,
  info: {
    firstName: 'Mario',
    googleEmail: 'email2@example.com',
    institutionEmail: 'example@example.com',
    displayName: 'Mario Rep',
    institutionWebsite: 'https://www.facit.on.ca',
    lastName: 'Rep',
    middleName: '',
    positionTitle: 'string',
    primaryAffiliation: 'OICR',
    suffix: 'string',
    title: 'M',
  },
};

const PdfRepFormData = ({ data }: { data: any }) => {
  const repFields = [
    PdfFormFields.NAME,
    PdfFormFields.PRIMARY_AFFILIATION,
    PdfFormFields.INSTITUTIONAL_EMAIL,
    PdfFormFields.POSITION_TITLE,
  ];

  // there may be a nicer way to handle the mailing address, but not going to worry about it right now
  // it's onyl used in 2 places
  const address = data?.sections.representative.address;
  const addressData = [
    {
      fieldName: 'Mailing Address',
      fieldValue: getStreetAddress(address.streetAddress, address.building),
    },
    {
      fieldValue: address.cityAndProvince,
    },
    {
      fieldValue: address.country,
    },
    { fieldValue: address.postalCode },
  ];

  return (
    <View>
      <View style={{ borderTop: `1px solid ${defaultTheme.colors.grey_1}`, paddingTop: '5px' }}>
        <SectionTitle>{FORM_TEXT.representative.title}</SectionTitle>
        <VerticalTable
          data={repFields.map((field) => ({
            fieldName: field.fieldName,
            fieldValue: data?.sections.representative.info[field.fieldKey],
          }))}
        />
      </View>
      <View
        style={{
          borderTop: `1px solid ${defaultTheme.colors.grey_1}`,
          marginTop: '25px',
          paddingTop: '5px',
        }}
      >
        <SectionTitle>{FORM_TEXT.representative.address}</SectionTitle>
        <VerticalTable data={addressData} useBorderStyle={false} />
      </View>
    </View>
  );
};

const StaticRepresentative = ({ isPdf = false, data = {} }: { isPdf?: boolean; data?: any }) => {
  const {
    TextComponent,
    TitleComponent,
    SectionComponent,
    ContainerComponent,
    LinkComponent,
  } = getStaticComponents(isPdf);

  return (
    <ContainerComponent
      appId={data.appId}
      state={data.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent>B. Institutional Representative</TitleComponent>
      <SectionComponent>
        <TextComponent>
          An Institutional Representative is a qualified representative of a legal entity{' '}
          <TextComponent as="span" bold style={{ fontWeight: 600 }}>
            who has the administrative power to legally commit that entity to the terms and
            conditions of the{' '}
            <LinkComponent href="#" target="_blank">
              Data Access Agreement
            </LinkComponent>
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
