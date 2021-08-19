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

import StaticTerms from 'components/pages/Applications/PDF/StaticTerms';

import { FormFieldValidationTriggerFunction, FormSectionValidationState_Terms } from './types';
import { isRequired } from './validations';
import FORM_TEXT from '../../PDF/textConstants';
import { getStaticComponents } from '../../PDF/common';

const Terms = ({
  isSectionDisabled,
  localState,
  validateFieldTouched,
}: {
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_Terms;
  validateFieldTouched: FormFieldValidationTriggerFunction;
}): ReactElement => {
  const { SectionTitle } = getStaticComponents(false);

  return (
    <article>
      <section>
        <StaticTerms />
      </section>
      <section>
        <SectionTitle>{FORM_TEXT.terms.title}</SectionTitle>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.agreement?.error}
          required={isRequired(localState.agreement)}
        >
          <FormCheckbox
            aria-label="I acknowledge that I have read and understand the above terms."
            checked={localState.agreement?.value}
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value="agreement"
          >
            <Typography bold component="span">
              I acknowledge
            </Typography>{' '}
            that I have read and understand the above terms.
          </FormCheckbox>

          <FormHelperText onErrorOnly>{localState.agreement?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default Terms;
