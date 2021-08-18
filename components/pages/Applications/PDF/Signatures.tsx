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
import { View, StyleSheet } from '@react-pdf/renderer';

import PDFLayout from './PdfLayout';
import {
  getFieldValue,
  PdfFormFields,
  PDFLink,
  PDFParagraph,
  PDFText,
  PDFTitle,
  SectionTitle,
} from './common';
import VerticalTable from './VerticalTable';
import { ApplicationData } from '../types';
import { ADOBE_ACROBAT_LINK, DOCUSIGN_LINK } from 'global/constants/externalPaths';
import { styles as commonStyles } from './common';

const styles = StyleSheet.create({
  table: {
    marginBottom: '25pt',
    borderBottom: `1pt solid ${defaultTheme.colors.grey_1}`,
  },
});

const Signature = () => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      height: '30pt',
    }}
  >
    <PDFText style={{ fontWeight: 'semibold', marginRight: '10pt' }}>Signature:</PDFText>
    <View
      style={{
        borderTop: `2pt solid ${defaultTheme.colors.black}`,
        marginTop: '2pt',
        width: '90%',
      }}
    />
  </View>
);

const Signatures = ({ data }: { data?: ApplicationData }) => {
  const signerFields = [
    PdfFormFields.NAME,
    PdfFormFields.PRIMARY_AFFILIATION,
    PdfFormFields.POSITION_TITLE,
  ];

  const applicantData = signerFields.map((field) => ({
    fieldName: field.fieldName,
    fieldValue: getFieldValue(data?.sections.applicant.info, field.fieldKey),
  }));

  const representativeData = signerFields.map((field) => ({
    fieldName: field.fieldName,
    fieldValue: getFieldValue(data?.sections.representative.info, field.fieldKey),
  }));

  const dacoData = ['Name', 'Title', 'Date of Approval'].map((fieldName: string) => ({
    fieldName,
    fieldValue: '',
  }));

  return (
    <PDFLayout appId={data?.appId} state={data?.state} applicant={data?.sections?.applicant.info}>
      <PDFTitle>Signatures</PDFTitle>
      <View>
        <PDFParagraph>
          The final step involves adding the proper signatures to authorize this application. Please
          do the following:
        </PDFParagraph>
        <PDFText count={1} style={{ fontWeight: 'semibold', marginBottom: '2pt' }}>
          You must include BOTH the Principal Investigator and the Institutional Representative
          signatures in order for your application to be reviewed.
        </PDFText>

        <PDFText style={{ marginLeft: '20pt' }}>
          a) You can print this page, collect the written signatures, scan the signed page and add
          it back to the finalized application pdf.
        </PDFText>
        <PDFText style={{ marginLeft: '20pt', marginBottom: '10pt' }}>
          b) Or you can add the proper signatures using electronic methods, such as{' '}
          <PDFLink href={DOCUSIGN_LINK}>DocuSign</PDFLink> or{' '}
          <PDFLink href={ADOBE_ACROBAT_LINK}>AdobeSign</PDFLink>.
        </PDFText>
        <PDFText count={2}>Upload the signed application to your online DACO application.</PDFText>
      </View>
      <View
        style={{
          borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
          marginTop: '15pt',
          marginBottom: '15pt',
          paddingTop: '5pt',
        }}
      >
        <SectionTitle>APPLICANT AUTHORIZATION</SectionTitle>
        <VerticalTable style={styles.table} useInternalBorders data={applicantData} />
        <Signature />
      </View>
      <View
        style={{
          borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
          marginTop: '15pt',
          marginBottom: '25pt',
          paddingTop: '5pt',
        }}
      >
        <SectionTitle>INSTITUTIONAL REPRESENTATIVE AUTHORIZATION</SectionTitle>
        <VerticalTable style={styles.table} useInternalBorders data={representativeData} />
        <Signature />
      </View>
      <View
        style={{ border: `2pt solid ${defaultTheme.colors.black}`, padding: '10pt' }}
        wrap={false}
      >
        <PDFParagraph style={{ ...commonStyles.highlighted, fontWeight: 'semibold' }}>
          Reserved for the ICGC Data Access Compliance Office (ICGC DACO)
        </PDFParagraph>
        <VerticalTable useInternalBorders data={dacoData} style={styles.table} />
        <Signature />
      </View>
    </PDFLayout>
  );
};

export default Signatures;
