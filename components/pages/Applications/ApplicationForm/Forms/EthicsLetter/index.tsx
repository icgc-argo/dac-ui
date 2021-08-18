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

import { ReactElement, useEffect, useState } from 'react';
import { css } from '@emotion/core';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import FormRadio from '@icgc-argo/uikit/form/FormRadio';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Link from '@icgc-argo/uikit/Link';
import RadioCheckboxGroup from '@icgc-argo/uikit/form/RadioCheckboxGroup';
import Typography from '@icgc-argo/uikit/Typography';

import StaticEthics from 'components/pages/Applications/PDF/StaticEthics';
import FORM_TEXT from 'components/pages/Applications/PDF/textConstants';

import {
  FormFieldValidationTriggerFunction,
  FormSectionValidationState_EthicsLetter,
  FormValidationAction,
} from '../types';
import { isRequired } from '../validations';
import UploadsTable from './UploadsTable';
import { getStaticComponents } from 'components/pages/Applications/PDF/common';
import { ApplicationState } from 'components/pages/Applications/types';

const EthicsLetter = ({
  appId,
  isSectionDisabled,
  localState,
  refetchAllData,
  validateFieldTouched,
  applicationState,
}: {
  appId: string;
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_EthicsLetter;
  refetchAllData: (action?: Partial<FormValidationAction>) => void;
  validateFieldTouched: FormFieldValidationTriggerFunction;
  applicationState: ApplicationState;
}): ReactElement => {
  // applicant made ethics letter required (option 2)
  // and application has been approved
  const isRequiredPostApproval = !isSectionDisabled &&
    applicationState === ApplicationState.APPROVED;

  const [selectedRadioValue, setSelectedRadioValue] = useState(
    localState.declaredAsRequired?.value || null,
  );
  // this handler was customised to handle things that ought be handled by the RadioCheckboxGroup itself
  // TODO: improve that, as well as implement the component's focus/blur
  // which will be needed to implement "required field" error behaviours
  const handleSelectedRadioValueChange = (value: boolean) => {
    validateFieldTouched({
      // faking event values to keep scope limited
      target: {
        id: 'declaredAsRequired',
        tagName: 'INPUT',
        type: 'radio',
        value,
      },
      type: 'change',
    });

    setSelectedRadioValue(value);
  };

  const isChecked = (radioValue: boolean) => radioValue === selectedRadioValue;

  useEffect(() => {
    setSelectedRadioValue(localState.declaredAsRequired?.value);
  }, [localState.declaredAsRequired?.value]);

  const { SectionTitle } = getStaticComponents(false);

  return (
    <article>
      <StaticEthics />

      <section>
        <SectionTitle>
          {FORM_TEXT.ethics.title}
        </SectionTitle>

        <FormControl
          className="vertical"
          disabled={isSectionDisabled}
          error={!!localState.declaredAsRequired?.error}
          required={isRequired(localState.declaredAsRequired)}
        >
          <InputLabel htmlFor="declaredAsRequired">
            {FORM_TEXT.ethics.inputLabel.declaration}
          </InputLabel>

          <RadioCheckboxGroup
            css={css`
              margin-top: 15px;
            `}
            disabled={isSectionDisabled || isRequiredPostApproval}
            id="declaredAsRequired"
            isChecked={isChecked}
            onChange={handleSelectedRadioValueChange}
          >
            <FormRadio value={false}>
              {FORM_TEXT.ethics.declarationOptions.notRequired}
            </FormRadio>
            <FormRadio value={true}>
              {FORM_TEXT.ethics.declarationOptions.required.a}{' '}
              <Typography bold component="span">
                {FORM_TEXT.ethics.declarationOptions.required.b}{' '}
                {FORM_TEXT.ethics.declarationOptions.required.link}
                {FORM_TEXT.ethics.declarationOptions.required.c}
              </Typography>
            </FormRadio>
          </RadioCheckboxGroup>

          <FormHelperText onErrorOnly>{localState.declaredAsRequired?.error?.[0]}</FormHelperText>
        </FormControl>

        {selectedRadioValue && (
          <UploadsTable
            appId={appId}
            isSectionDisabled={isSectionDisabled}
            localState={localState}
            refetchAllData={refetchAllData}
            required={isRequired(localState.approvalLetterDocs)}
            isRequiredPostApproval={isRequiredPostApproval}
          />
        )}
      </section>
    </article>
  );
};

export default EthicsLetter;
