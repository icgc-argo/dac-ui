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

import RequiredFieldsMessage from '../ApplicationForm/Forms/RequiredFieldsMessage';
import {
  Checkbox,
  getStaticComponents,
  PDFLink,
  PDFParagraph,
  PDFText,
  SectionTitle,
} from './common';
import FORM_TEXT from './textConstants';
import { View } from '@react-pdf/renderer';
import { css } from '@icgc-argo/uikit';
import { BANNER_VARIANTS } from '@icgc-argo/uikit/notifications/Banner';
import Table from './Table';
import { ApplicationData, ApprovalDoc } from '../../Applications/types';
import { isNull } from 'lodash';

const StaticAttachLetterMessage = ({ isPdf = false }: { isPdf: boolean }) => {
  const { GenericContainer, TextComponent } = getStaticComponents(isPdf);
  return (
    <GenericContainer>
      <TextComponent bold style={{ fontWeight: 600 }}>
        Please attach an ethics approval letter to this application.
      </TextComponent>
      <TextComponent>
        If the ethics approval is written in a language other than English,{' '}
        <TextComponent bold as="span" style={{ fontWeight: 600 }}>
          please upload a version translated to English
        </TextComponent>
        <TextComponent>.</TextComponent>
      </TextComponent>
    </GenericContainer>
  );
};

const ApprovalLetterDocs = ({ data = [] }: { data?: ApprovalDoc[] }) => {
  return (
    <Table
      headers={[
        { name: 'Filename', accessor: 'name' },
        { name: 'Uploaded on', accessor: 'uploadedAtUtc' },
      ]}
      data={data}
    />
  );
};

const PdfEthicsFormData = ({ data }: { data?: ApplicationData }) => {
  // check if null first, as this means neither has been checked
  const ethicsRequiredPresent = !isNull(data?.sections.ethicsLetter.declaredAsRequired);
  const ethicsRequired = ethicsRequiredPresent && !!data?.sections.ethicsLetter.declaredAsRequired;

  const OptionTwo = (
    <View>
      {FORM_TEXT.ethics.declarationOptions.required.a}{' '}
      <PDFText>
        {FORM_TEXT.ethics.declarationOptions.required.b}{' '}
        {FORM_TEXT.ethics.declarationOptions.required.link}
        {FORM_TEXT.ethics.declarationOptions.required.c}
      </PDFText>
    </View>
  );

  return (
    <View
      style={{
        borderTop: `1px solid ${defaultTheme.colors.grey_1}`,
        paddingTop: '5px',
        marginBottom: '15pt',
      }}
    >
      <SectionTitle>{FORM_TEXT.ethics.title}</SectionTitle>
      <View style={{ marginBottom: '10pt' }}>
        <Checkbox
          TextComponent={FORM_TEXT.ethics.declarationOptions.notRequired}
          checked={ethicsRequiredPresent && !ethicsRequired}
        />
      </View>
      <View>
        <Checkbox TextComponent={OptionTwo} checked={ethicsRequired} />
      </View>
      {ethicsRequired && (
        <View style={{ marginTop: '15pt' }}>
          <StaticAttachLetterMessage isPdf />
          <ApprovalLetterDocs data={data?.sections.ethicsLetter.approvalLetterDocs} />
        </View>
      )}
    </View>
  );
};

const StaticEthics = ({ isPdf = false, data }: { isPdf?: boolean; data?: ApplicationData }) => {
  const {
    ContainerComponent,
    SectionComponent,
    TextComponent,
    TitleComponent,
    BannerComponent,
  } = getStaticComponents(isPdf);

  return (
    <ContainerComponent
      appId={data?.appId}
      state={data?.state}
      applicant={data?.sections?.applicant.info}
    >
      <TitleComponent>E. Ethics</TitleComponent>

      <SectionComponent>
        <TextComponent>
          ICGC is aware that some countries/regions do not require ethics approval for use of coded
          data (i.e. use of the ICGC Controlled Data). Depending on the nature of your research
          project, it is possible, however, that such approval is needed in your country. If you are
          uncertain as to whether your research project needs ethics approval to use ICGC Controlled
          Data, we suggest you contact your local institutional review board / research ethics
          committee (IRB/REC) to clarify the matter.
        </TextComponent>

        <BannerComponent
          css={css`
            margin-top: 15px;
          `}
          content={
            <TextComponent style={{ margin: 0 }}>
              <TextComponent bold component="span" style={{ fontWeight: 600 }}>
                Please note:
              </TextComponent>{' '}
              The ICGC DACO and the ICGC are not responsible for the ethics approval/monitoring of
              individual research projects and bear no responsibility for the applicant's failure to
              comply with local/national ethical requirements.
            </TextComponent>
          }
          size="SM"
          variant={BANNER_VARIANTS.WARNING}
        />

        {!isPdf && <RequiredFieldsMessage />}
        {isPdf && (
          <View>
            <PdfEthicsFormData data={data} />
          </View>
        )}
      </SectionComponent>
    </ContainerComponent>
  );
};

export default StaticEthics;
