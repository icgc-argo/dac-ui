import React from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { getStaticComponents, SectionTitle } from './common';
import FORM_TEXT from './textConstants';
import { View } from '@react-pdf/renderer';
import VerticalTable from './VerticalTable';
import { getStreetAddress } from './StaticRepresentative';

const applicantFields: { fieldName: string; fieldKey: string }[] = [
  { fieldName: 'Name', fieldKey: 'displayName' },
  { fieldName: 'Primary Affiliation', fieldKey: 'primaryAffiliation' },
  { fieldName: 'Institutional Email', fieldKey: 'institutionEmail' },
  { fieldName: 'Google Email', fieldKey: 'googleEmail' },
  { fieldName: 'Researcher Profile URL', fieldKey: 'institutionWebsite' },
  { fieldName: 'Position Title', fieldKey: 'positionTitle' },
];

const StaticApplicant = ({ isPdf = false, data = {} }: { isPdf?: boolean; data?: any }) => {
  const {
    TextComponent,
    TitleComponent,
    SectionComponent,
    ContainerComponent,
  } = getStaticComponents(isPdf);

  // is there a more generalized way of parsing the data? not sure, as each section is different
  // and the pdf is different from the ui
  // perhaps at least making a list/enum of all the fields to be parsed from the api data
  // parse it out in the Actions api request, or better to parse it here?
  let applicantData: any[] = [];
  let address;
  let addressData: any[] = [];
  if (isPdf) {
    applicantData = applicantFields.map(({ fieldName, fieldKey }) => {
      return { fieldName, fieldValue: data.sections.applicant.info[fieldKey] };
    });

    address = data.sections.applicant.address;
    addressData = [
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
  }

  return (
    <ContainerComponent
      appId={data.appId}
      state={data.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent>A. Applicant Information (Principal Investigator)</TitleComponent>
      <SectionComponent>
        <TextComponent>
          Qualified applicants for access to the ICGC Controlled Data{' '}
          <TextComponent as="span" bold style={{ fontWeight: 600 }}>
            must be independent researchers who are affiliated with a legal entity
          </TextComponent>{' '}
          (e.g. university professor, researcher in a private company, independent researchers able
          to apply for federal research grants, etc.).
        </TextComponent>

        <TextComponent>
          Please include a valid Google email address that will be used to log in to ICGC ARGO and
          ICGC 25K and will be the email address associated with ICGC Controlled Data access.
        </TextComponent>
        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>
      {isPdf && (
        <View>
          <View style={{ borderTop: `1px solid ${defaultTheme.colors.grey_1}`, paddingTop: '5px' }}>
            <SectionTitle>{FORM_TEXT.applicant.title}</SectionTitle>
            <VerticalTable data={applicantData} />
          </View>
          <View
            style={{
              borderTop: `1px solid ${defaultTheme.colors.grey_1}`,
              marginTop: '25px',
              paddingTop: '5px',
            }}
          >
            <SectionTitle>{FORM_TEXT.applicant.address}</SectionTitle>
            <VerticalTable data={addressData} useBorderStyle={false} />
          </View>
        </View>
      )}
    </ContainerComponent>
  );
};

export default StaticApplicant;
