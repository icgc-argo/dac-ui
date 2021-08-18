/*
 * Copyright (c) 2021 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from 'react';
import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';
import { View } from '@react-pdf/renderer';

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { getFieldValue, getStaticComponents, PdfFormFields, SectionTitle } from './common';
import FORM_TEXT from './textConstants';
import VerticalTable from './VerticalTable';
import { getStreetAddress } from './common';
import { ApplicationData } from '../types';

const PdfApplicantFormData = ({ data }: { data?: ApplicationData }) => {
  const applicantFields = [
    PdfFormFields.NAME,
    PdfFormFields.PRIMARY_AFFILIATION,
    PdfFormFields.INSTITUTIONAL_EMAIL,
    PdfFormFields.GOOGLE_EMAIL,
    PdfFormFields.RESEARCHER_PROFILE_URL,
    PdfFormFields.POSITION_TITLE,
  ];
  const applicantData = applicantFields.map(({ fieldName, fieldKey }) => {
    return { fieldName, fieldValue: getFieldValue(data?.sections.applicant.info, fieldKey) };
  });

  const address = data?.sections.applicant.address;
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
      <View>
        <SectionTitle>{FORM_TEXT.applicant.title}</SectionTitle>
        <VerticalTable data={applicantData} />
      </View>
      <View
        style={{
          borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
          marginTop: '25pt',
          paddingTop: '5pt',
        }}
      >
        <SectionTitle>{FORM_TEXT.applicant.address}</SectionTitle>
        <VerticalTable data={addressData} useInternalBorders={false} />
      </View>
    </View>
  );
};

const StaticApplicant = ({ isPdf = false, data }: { isPdf?: boolean; data?: ApplicationData }) => {
  const {
    TextComponent,
    TitleComponent,
    SectionComponent,
    ContainerComponent,
  } = getStaticComponents(isPdf);

  return (
    <ContainerComponent
      appId={data?.appId}
      state={data?.state}
      applicant={data?.sections.applicant.info}
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
          Please include a valid Google or G Suite enabled email address that will be used to log in
          to ICGC ARGO and ICGC 25K and will be the email address associated with ICGC Controlled
          Data access.
        </TextComponent>
        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>
      <SectionComponent
        style={{ borderTop: `1px solid ${defaultTheme.colors.grey_1}`, paddingTop: '5px' }}
      >
        {isPdf && <PdfApplicantFormData data={data} />}
      </SectionComponent>
    </ContainerComponent>
  );
};

export default StaticApplicant;
