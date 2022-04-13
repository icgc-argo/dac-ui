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

import { ReactElement } from 'react';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Input from '@icgc-argo/uikit/form/Input';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Textarea from '@icgc-argo/uikit/form/Textarea';

import FormFieldHelpBubble from '../FormFieldHelpBubble';
import {
  FormFieldValidationTriggerFunction,
  FormSectionValidationState_ProjectInfo,
} from '../types';
import { isRequired } from '../validations';
import PublicationURLs from './PublicationURLs';
import StaticProjectInfo, {
  AimsBubble,
  BackgroundBubble,
  DataUseBubble,
  LaySummaryBubble,
  StaticLaySummary,
  StaticResearchSummary,
} from '../../../PDF/StaticProjectInfo';
import FORM_TEXT from 'components/pages/Applications/PDF/textConstants';
import { getStaticComponents } from '../../../PDF/common';
import { projectInfoSectionMaxWords } from '../validations/schemas';

const ProjectInfo = ({
  isSectionDisabled,
  localState,
  validateFieldTouched,
  sectionLastUpdatedAt,
  errorsList,
}: {
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_ProjectInfo;
  validateFieldTouched: FormFieldValidationTriggerFunction;
  sectionLastUpdatedAt: string;
  errorsList?: string[];
}): ReactElement => {
  const { SectionTitle } = getStaticComponents(false);
  return (
    <article>
      <StaticProjectInfo sectionLastUpdatedAt={sectionLastUpdatedAt} />

      <section>
        <SectionTitle>{FORM_TEXT.project_info.basic_info}</SectionTitle>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.title?.error}
          required={isRequired(localState.title)}
        >
          <InputLabel htmlFor="title">Project Title</InputLabel>

          <Input
            aria-label="Project Title"
            id="title"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value={localState.title?.value}
          />

          <FormHelperText onErrorOnly>{localState.title?.error?.[0]}</FormHelperText>
        </FormControl>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.website?.error}
          required={isRequired(localState.website)}
        >
          <InputLabel htmlFor="website">Project Website</InputLabel>

          <Input
            aria-label="Project Website"
            id="website"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value={localState.website?.value}
          />

          <FormHelperText onErrorOnly>{localState.website?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>

      <section>
        <StaticResearchSummary />

        <FormControl
          className="vertical"
          disabled={isSectionDisabled}
          error={!!localState.background?.error}
          required={isRequired(localState.background)}
        >
          <InputLabel htmlFor="background">
            {FORM_TEXT.project_info.inputLabel.background}
          </InputLabel>
          <FormFieldHelpBubble text={<BackgroundBubble />} />

          <Textarea
            aria-label={FORM_TEXT.project_info.inputLabel.background}
            countLimit={projectInfoSectionMaxWords}
            countPosition="absolute"
            countType="words"
            id="background"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            placeholder=""
            rows={6}
            value={localState.background?.value}
          />

          <FormHelperText onErrorOnly>{localState.background?.error?.[0]}</FormHelperText>
        </FormControl>

        <FormControl
          className="vertical"
          disabled={isSectionDisabled}
          error={!!localState.aims?.error}
          required={isRequired(localState.aims)}
        >
          <InputLabel htmlFor="aims">{FORM_TEXT.project_info.inputLabel.aims}</InputLabel>
          <FormFieldHelpBubble text={<AimsBubble />} />

          <Textarea
            aria-label={FORM_TEXT.project_info.inputLabel.aims}
            countLimit={projectInfoSectionMaxWords}
            countPosition="absolute"
            countType="words"
            id="aims"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            placeholder=""
            rows={6}
            value={localState.aims?.value}
          />

          <FormHelperText onErrorOnly>{localState.aims?.error?.[0]}</FormHelperText>
        </FormControl>

        <FormControl
          className="vertical"
          disabled={isSectionDisabled}
          error={!!localState.methodology?.error}
          required={isRequired(localState.methodology)}
        >
          <InputLabel htmlFor="aims">{FORM_TEXT.project_info.inputLabel.dataUse}</InputLabel>
          <FormFieldHelpBubble text={<DataUseBubble />} />

          <Textarea
            aria-label={FORM_TEXT.project_info.inputLabel.dataUse}
            countLimit={projectInfoSectionMaxWords}
            countPosition="absolute"
            countType="words"
            id="methodology"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            placeholder=""
            rows={6}
            value={localState.methodology?.value}
          />

          <FormHelperText onErrorOnly>{localState.methodology?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>

      <section>
        <StaticLaySummary />

        <FormControl
          className="vertical"
          disabled={isSectionDisabled}
          error={!!localState.summary?.error}
          required={isRequired(localState.summary)}
        >
          <InputLabel htmlFor="summary">{FORM_TEXT.project_info.inputLabel.laySummary}</InputLabel>
          <FormFieldHelpBubble text={<LaySummaryBubble />} />

          <Textarea
            aria-label={FORM_TEXT.project_info.inputLabel.laySummary}
            countLimit={projectInfoSectionMaxWords}
            countPosition="absolute"
            countType="words"
            id="summary"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            placeholder=""
            rows={6}
            value={localState.summary?.value}
          />

          <FormHelperText onErrorOnly>{localState.summary?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>

      <PublicationURLs
        {...localState.publicationsURLs}
        isSectionDisabled={isSectionDisabled}
        validateFieldTouched={validateFieldTouched}
        errorsList={errorsList}
      />
    </article>
  );
};

export default ProjectInfo;
