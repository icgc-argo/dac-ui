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
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Typography from '@icgc-argo/uikit/Typography';

import {
  FormFieldValidationTriggerFunction,
  FormSectionValidationState_DataAccessAgreements,
} from './types';
import { isRequired } from './validations';
import StaticDataAccessAgreement, {
  StaticDataAgreementsFormSection,
} from '../../PDF/StaticDataAccessAgreement';
import FORM_TEXT from '../../PDF/textConstants';

const DataAccessAgreement = ({
  isSectionDisabled,
  localState,
  validateFieldTouched,
}: {
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_DataAccessAgreements;
  validateFieldTouched: FormFieldValidationTriggerFunction;
}): ReactElement => {
  return (
    <article>
      <StaticDataAccessAgreement />

      <section>
        <StaticDataAgreementsFormSection />
        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.it_agreement_software_updates?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_software_updates)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.dataAccessAgreements.declarations.it_agreement_software_updates}
            checked={localState.agreements?.fields?.it_agreement_software_updates?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_software_updates"
          >
            <Typography bold component="span">
              {FORM_TEXT.dataAccessAgreements.yes}
            </Typography>
            {FORM_TEXT.dataAccessAgreements.commaSeparator}
            {FORM_TEXT.dataAccessAgreements.declarations.it_agreement_software_updates}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_software_updates?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.it_agreement_protect_data?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_protect_data)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.dataAccessAgreements.declarations.it_agreement_protect_data}
            checked={localState.agreements?.fields?.it_agreement_protect_data?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_protect_data"
          >
            <Typography bold component="span">
              {FORM_TEXT.dataAccessAgreements.yes}
            </Typography>
            {FORM_TEXT.dataAccessAgreements.commaSeparator}
            {FORM_TEXT.dataAccessAgreements.declarations.it_agreement_protect_data}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_protect_data?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.it_agreement_monitor_access?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_monitor_access)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.dataAccessAgreements.declarations.it_agreement_monitor_access}
            checked={localState.agreements?.fields?.it_agreement_monitor_access?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_monitor_access"
          >
            <Typography bold component="span">
              {FORM_TEXT.dataAccessAgreements.yes}
            </Typography>
            {FORM_TEXT.dataAccessAgreements.commaSeparator}
            {FORM_TEXT.dataAccessAgreements.declarations.it_agreement_monitor_access}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_monitor_access?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.it_agreement_destroy_copies?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_destroy_copies)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.dataAccessAgreements.declarations.it_agreement_destroy_copies}
            checked={localState.agreements?.fields?.it_agreement_destroy_copies?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_destroy_copies"
          >
            <Typography bold component="span">
              {FORM_TEXT.dataAccessAgreements.yes}
            </Typography>
            {FORM_TEXT.dataAccessAgreements.commaSeparator}
            {FORM_TEXT.dataAccessAgreements.declarations.it_agreement_destroy_copies}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_destroy_copies?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.it_agreement_onboard_training?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_onboard_training)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.dataAccessAgreements.declarations.it_agreement_onboard_training}
            checked={localState.agreements?.fields?.it_agreement_onboard_training?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_onboard_training"
          >
            <Typography bold component="span">
              {FORM_TEXT.dataAccessAgreements.yes}
            </Typography>
            {FORM_TEXT.dataAccessAgreements.commaSeparator}
            {FORM_TEXT.dataAccessAgreements.declarations.it_agreement_onboard_training}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_onboard_training?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          disabled={isSectionDisabled}
          error={
            !!localState.agreements?.fields?.it_agreement_provide_institutional_policies?.error
          }
          required={isRequired(
            localState.agreements?.fields?.it_agreement_provide_institutional_policies,
          )}
        >
          <FormCheckbox
            aria-label={
              FORM_TEXT.dataAccessAgreements.declarations
                .it_agreement_provide_institutional_policies
            }
            checked={
              localState.agreements?.fields?.it_agreement_provide_institutional_policies?.value
            }
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_provide_institutional_policies"
          >
            <Typography bold component="span">
              {FORM_TEXT.dataAccessAgreements.yes}
            </Typography>
            {FORM_TEXT.dataAccessAgreements.commaSeparator}
            {
              FORM_TEXT.dataAccessAgreements.declarations
                .it_agreement_provide_institutional_policies
            }
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_provide_institutional_policies?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.it_agreement_contact_daco_fraud?.error}
          required={isRequired(localState.agreements?.fields?.it_agreement_contact_daco_fraud)}
        >
          <FormCheckbox
            aria-label={FORM_TEXT.dataAccessAgreements.declarations.it_agreement_contact_daco_fraud}
            checked={localState.agreements?.fields?.it_agreement_contact_daco_fraud?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--it_agreement_contact_daco_fraud"
          >
            <Typography bold component="span">
              {FORM_TEXT.dataAccessAgreements.yes}
            </Typography>
            {FORM_TEXT.dataAccessAgreements.commaSeparator}
            {FORM_TEXT.dataAccessAgreements.declarations.it_agreement_contact_daco_fraud}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.it_agreement_contact_daco_fraud?.error?.[0]}
          </FormHelperText>
        </FormControl>
        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.daa_correct_application_content?.error}
          required={isRequired(localState.agreements?.fields?.daa_correct_application_content)}
        >
          <FormCheckbox
            aria-label="You certify that the contents in the application are true and correct to the best of your knowledge and belief."
            checked={localState.agreements?.fields?.daa_correct_application_content?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--daa_correct_application_content"
          >
            <Typography bold component="span">
              {FORM_TEXT.dataAccessAgreements.yes}
            </Typography>
            {FORM_TEXT.dataAccessAgreements.commaSeparator}
            {FORM_TEXT.dataAccessAgreements.declarations.daa_correct_application_content}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.daa_correct_application_content?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreements?.fields?.daa_agree_to_terms?.error}
          required={isRequired(localState.agreements?.fields?.daa_agree_to_terms)}
        >
          <FormCheckbox
            aria-label="You have read and agree to abide by the terms and conditions outlined in the Data Access Agreement."
            checked={localState.agreements?.fields?.daa_agree_to_terms?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreements--daa_agree_to_terms"
          >
            <Typography bold component="span">
              {FORM_TEXT.dataAccessAgreements.yes}
            </Typography>
            {FORM_TEXT.dataAccessAgreements.commaSeparator}
            {FORM_TEXT.dataAccessAgreements.declarations.daa_agree_to_terms}
          </FormCheckbox>

          <FormHelperText onErrorOnly>
            {localState.agreements?.fields?.daa_agree_to_terms?.error?.[0]}
          </FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default DataAccessAgreement;
