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

import defaultTheme from '@icgc-argo/uikit/theme/defaultTheme';

import { View, Text, StyleSheet } from '@react-pdf/renderer';
import PDFLayout from './PdfLayout';
import PDFIcgcDaco from './icons/PdfIcgcDaco';
import { getDisplayName, PDFText, PDFTitle } from './common';
import VerticalTable from './VerticalTable';
import { ApplicationData } from '../types';
import { getFormattedDate } from 'global/utils/dates/helpers';
import { DateFormat } from 'global/utils/dates/types';
import { FieldAccessor } from './types';

const styles = StyleSheet.create({
  tableValue: {
    color: defaultTheme.colors.secondary,
    fontWeight: 'semibold',
  },
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: '50pt',
  },
  subtitle: {
    marginTop: '20pt',
  },
  table: {
    padding: '10pt 5pt 10pt 5pt',
    width: '460pt',
  },
});

const Cover = ({ data }: { data?: ApplicationData }) => {
  const piData = [
    {
      fieldName: 'DACO Application #',
      fieldValue: <Text style={styles.tableValue}>{data?.appId}</Text>,
    },
    {
      fieldName: 'Principal Investigator',
      fieldValue: (
        <Text style={styles.tableValue}>{getDisplayName(data?.sections.applicant.info)}</Text>
      ),
    },
    {
      fieldName: 'Institution',
      fieldValue: (
        <Text style={styles.tableValue}>
          {data?.sections.applicant.info[FieldAccessor.PRIMARY_AFFILIATION]}
        </Text>
      ),
    },
    {
      fieldName: 'Document rendered on',
      fieldValue: (
        <Text style={styles.tableValue}>
          {getFormattedDate(Date.now(), DateFormat.TIME_DAY_AND_DATE_FORMAT)}
        </Text>
      ),
    },
  ];

  return (
    <PDFLayout appId={data?.appId} state={data?.state} applicant={data?.sections?.applicant.info}>
      <View style={styles.container}>
        <PDFIcgcDaco />
        <PDFText style={styles.subtitle}>ICGC DATA ACCESS COMPLIANCE OFFICE</PDFText>
        <PDFTitle style={styles.title}>Application for Access to ICGC Controlled Data</PDFTitle>
        <VerticalTable
          style={styles.table}
          headerCellWidth={40}
          useExternalBorders
          useInternalBorders={false}
          data={piData}
        />
      </View>
    </PDFLayout>
  );
};

export default Cover;
