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

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import { Checkbox, getStaticComponents, PDFLink, styles } from './common';
import FORM_TEXT from './textConstants';
import { View, Text } from '@react-pdf/renderer';
import { AppendixAgreement } from '../types';
import { appendicesLinks } from 'global/constants';
import { StaticComponentProps } from './types';

export const ICGCPolicies = ({ isPdf = false }: { isPdf?: boolean }) => {
  const { SectionTitle } = getStaticComponents(isPdf);
  return <SectionTitle>ICGC POLICIES</SectionTitle>;
};

const Appendix = ({ agreement }: { agreement: AppendixAgreement }) => {
  return (
    <View style={{ marginBottom: '10pt' }} wrap={false}>
      <Text
        style={{
          ...styles.text,
          textTransform: 'uppercase',
          fontWeight: 'semibold',
          marginBottom: '3pt',
        }}
      >
        {FORM_TEXT.appendices[agreement.name].title}
      </Text>
      <View style={{ paddingTop: 2, paddingBottom: 5 }}>
        <Checkbox
          TextComponent={
            <Text>
              {FORM_TEXT.appendices[agreement.name].text}
              <PDFLink style={styles.text}> ({appendicesLinks[agreement.name]})</PDFLink>
            </Text>
          }
          checked={agreement.accepted}
        />
      </View>
    </View>
  );
};

const StaticAppendices = ({ isPdf = false, data, sectionLastUpdatedAt }: StaticComponentProps) => {
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
      <TitleComponent sectionLastUpdatedAt={sectionLastUpdatedAt}>G. Appendices</TitleComponent>

      <SectionComponent>
        <TextComponent>Please review and agree to the following Appendices.</TextComponent>

        {!isPdf && <RequiredFieldsMessage />}
      </SectionComponent>
      {isPdf && (
        <View
          style={{
            borderTop: `1pt solid ${defaultTheme.colors.grey_1}`,
            marginTop: '15pt',
            paddingTop: '5pt',
          }}
        >
          <ICGCPolicies isPdf={isPdf} />
          {data?.sections.appendices.agreements.map((agreement) => (
            <Appendix key={agreement.name} agreement={agreement} />
          ))}
        </View>
      )}
    </ContainerComponent>
  );
};

export default StaticAppendices;
