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
import { css } from '@icgc-argo/uikit';
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Input from '@icgc-argo/uikit/form/Input';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import MultiSelect, { Option } from '@icgc-argo/uikit/form/MultiSelect';
import Select from '@icgc-argo/uikit/form/Select';

import { countriesList, honorificsList } from './constants';
import DoubleFieldRow from './DoubleFieldRow';
import {
  FormFieldValidationTriggerFunction,
  FormSectionValidationState_Applicant,
  FormSectionValidationState_Representative,
} from './types';
import { isRequired } from './validations';
import { transformToSelectOptions } from './validations/helpers';
import StaticRepresentative from '../../PDF/StaticRepresentative';
import FORM_TEXT from '../../PDF/textConstants';
import { getStaticComponents } from '../../PDF/common';

const Representative = ({
  applicantAddress,
  isSectionDisabled,
  localState,
  validateFieldTouched,
  sectionLastUpdatedAt,
}: {
  applicantAddress?: FormSectionValidationState_Applicant;
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_Representative;
  validateFieldTouched: FormFieldValidationTriggerFunction;
  sectionLastUpdatedAt: string;
}): ReactElement => {
  const addressSameAsApplicant = !!localState.addressSameAsApplicant?.value;
  const isAddressDisabled = isSectionDisabled || addressSameAsApplicant;
  const addressState = addressSameAsApplicant && applicantAddress ? applicantAddress : localState;

  const { SectionTitle } = getStaticComponents(false);

  return (
    <article>
      <StaticRepresentative sectionLastUpdatedAt={sectionLastUpdatedAt} />

      <section>
        <SectionTitle>{FORM_TEXT.representative.title}</SectionTitle>

        <DoubleFieldRow>
          <FormControl
            disabled={isSectionDisabled}
            error={!!localState.info_title?.error}
            required={isRequired(localState.info_title)}
          >
            <InputLabel htmlFor="info_title">Title</InputLabel>

            <Select
              aria-label="Title"
              id="info_title"
              onBlur={validateFieldTouched}
              onFocus={validateFieldTouched}
              eventOnChange={validateFieldTouched}
              options={transformToSelectOptions(honorificsList)}
              value={localState.info_title?.value}
            />

            <FormHelperText onErrorOnly>{localState.info_title?.error?.[0]}</FormHelperText>
          </FormControl>
          &nbsp;
        </DoubleFieldRow>

        <DoubleFieldRow>
          <FormControl
            disabled={isSectionDisabled}
            error={!!localState.info_firstName?.error}
            required={isRequired(localState.info_firstName)}
          >
            <InputLabel htmlFor="info_firstName">First Name</InputLabel>

            <Input
              aria-label="First Name"
              id="info_firstName"
              name="info_firstName"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              value={localState.info_firstName?.value}
            />

            <FormHelperText onErrorOnly>{localState.info_firstName?.error?.[0]}</FormHelperText>
          </FormControl>

          <FormControl
            disabled={isSectionDisabled}
            error={!!localState.info_middleName?.error}
            required={isRequired(localState.info_middleName)}
          >
            <InputLabel htmlFor="info_middleName">Middle Name</InputLabel>

            <Input
              aria-label="Middle Name"
              id="info_middleName"
              name="info_middleName"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              value={localState.info_middleName?.value}
            />

            <FormHelperText onErrorOnly>{localState.info_middleName?.error?.[0]}</FormHelperText>
          </FormControl>
        </DoubleFieldRow>

        <DoubleFieldRow>
          <FormControl
            disabled={isSectionDisabled}
            error={!!localState.info_lastName?.error}
            required={isRequired(localState.info_lastName)}
          >
            <InputLabel htmlFor="info_lastName">Last Name</InputLabel>

            <Input
              aria-label="Last Name"
              id="info_lastName"
              name="info_lastName"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              value={localState.info_lastName?.value}
            />

            <FormHelperText onErrorOnly>{localState.info_lastName?.error?.[0]}</FormHelperText>
          </FormControl>

          <FormControl
            disabled={isSectionDisabled}
            error={!!localState.info_suffix?.error}
            required={isRequired(localState.info_suffix)}
          >
            <InputLabel htmlFor="info_suffix">Suffix</InputLabel>

            <Input
              aria-label="Suffix, e.g. Jr., Sr., MD."
              id="info_suffix"
              name="info_suffix"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              placeholder="e.g. Jr., Sr., MD."
              value={localState.info_suffix?.value}
            />

            <FormHelperText onErrorOnly>{localState.info_suffix?.error?.[0]}</FormHelperText>
          </FormControl>
        </DoubleFieldRow>

        <DoubleFieldRow helpText="Must match the applicant’s primary affiliation exactly.">
          <FormControl
            disabled={isSectionDisabled}
            error={!!localState.info_primaryAffiliation?.error}
            required={isRequired(localState.info_primaryAffiliation)}
          >
            <InputLabel htmlFor="info_primaryAffiliation">Primary Affiliation</InputLabel>

            <Input
              aria-label="Primary Affiliation"
              id="info_primaryAffiliation"
              name="info_primaryAffiliation"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              value={localState.info_primaryAffiliation?.value}
            />

            <FormHelperText onErrorOnly>
              {localState.info_primaryAffiliation?.error?.[0]}
            </FormHelperText>
          </FormControl>
        </DoubleFieldRow>

        <DoubleFieldRow helpText="Must be the institutional email address of the Institutional Representative.">
          <FormControl
            disabled={isSectionDisabled}
            error={!!localState.info_institutionEmail?.error}
            required={isRequired(localState.info_institutionEmail)}
          >
            <InputLabel htmlFor="info_institutionEmail">Institutional Email</InputLabel>

            <Input
              aria-label="Institutional Email"
              id="info_institutionEmail"
              name="info_institutionEmail"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              value={localState.info_institutionEmail?.value}
            />

            <FormHelperText onErrorOnly>
              {localState.info_institutionEmail?.error?.[0]}
            </FormHelperText>
          </FormControl>
        </DoubleFieldRow>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.info_positionTitle?.error}
          required={isRequired(localState.info_positionTitle)}
        >
          <InputLabel htmlFor="info_positionTitle">Position Title</InputLabel>

          <Input
            aria-label="Position Title"
            id="info_positionTitle"
            name="info_positionTitle"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value={localState.info_positionTitle?.value}
          />

          <FormHelperText onErrorOnly>{localState.info_positionTitle?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>

      <section>
        <SectionTitle>{FORM_TEXT.representative.address}</SectionTitle>

        <FormControl disabled={isSectionDisabled}>
          <FormCheckbox
            aria-label="Address is the same as the Applicant."
            checked={localState.addressSameAsApplicant?.value}
            onChange={validateFieldTouched}
            value="addressSameAsApplicant"
          >
            Address is the same as the Applicant.
          </FormCheckbox>

          <FormHelperText onErrorOnly>{localState.agreement?.error?.[0]}</FormHelperText>
        </FormControl>

        <FormControl
          disabled={isAddressDisabled}
          error={!addressSameAsApplicant && !!localState.address_country?.error}
          required={isRequired(localState.address_country)}
        >
          <InputLabel htmlFor="address_country">Country</InputLabel>

          <MultiSelect
            aria-label="Country"
            css={css`
              > ol {
                max-height: 200px;
                overflow: auto;
              }
            `}
            id="address_country"
            name="address_country"
            onChange={validateFieldTouched}
            onBlur={validateFieldTouched}
            placeholder={false}
            single
            size="sm"
            value={addressState.address_country?.value ? [addressState.address_country?.value] : []}
          >
            {countriesList.map(({ name }) => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </MultiSelect>

          <FormHelperText onErrorOnly>{localState.address_country?.error?.[0]}</FormHelperText>
        </FormControl>

        <FormControl
          disabled={isAddressDisabled}
          error={!addressSameAsApplicant && !!localState.address_building?.error}
          required={isRequired(localState.address_building)}
        >
          <InputLabel htmlFor="address_building">Building</InputLabel>

          <Input
            aria-label="Building, e.g. MaRS Centre, South Tower"
            id="address_building"
            name="address_building"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            placeholder="e.g. MaRS Centre, South Tower"
            value={addressState.address_building?.value}
          />

          <FormHelperText onErrorOnly>{localState.address_building?.error?.[0]}</FormHelperText>
        </FormControl>

        <FormControl
          disabled={isAddressDisabled}
          error={!addressSameAsApplicant && !!localState.address_streetAddress?.error}
          required={isRequired(localState.address_streetAddress)}
        >
          <InputLabel htmlFor="address_streetAddress">Street Address</InputLabel>

          <Input
            aria-label="Street Address, e.g. 101 College Street, Suite 800"
            id="address_streetAddress"
            name="address_streetAddress"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            placeholder="e.g. 101 College Street, Suite 800"
            value={addressState.address_streetAddress?.value}
          />

          <FormHelperText onErrorOnly>
            {localState.address_streetAddress?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          disabled={isAddressDisabled}
          error={!addressSameAsApplicant && !!localState.address_cityAndProvince?.error}
          required={isRequired(localState.address_cityAndProvince)}
        >
          <InputLabel htmlFor="address_cityAndProvince">City and Province/State</InputLabel>

          <Input
            aria-label="City and Province/State"
            id="address_cityAndProvince"
            name="address_cityAndProvince"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            placeholder="e.g. Toronto, Ontario"
            value={addressState.address_cityAndProvince?.value}
          />

          <FormHelperText onErrorOnly>
            {localState.address_cityAndProvince?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          disabled={isAddressDisabled}
          error={!addressSameAsApplicant && !!localState.address_postalCode?.error}
          required={isRequired(localState.address_postalCode)}
        >
          <InputLabel htmlFor="address_postalCode">Postal/Zip Code</InputLabel>

          <Input
            aria-label="Postal/Zip Code"
            id="address_postalCode"
            name="address_postalCode"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value={addressState.address_postalCode?.value}
          />

          <FormHelperText onErrorOnly>{localState.address_postalCode?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default Representative;
