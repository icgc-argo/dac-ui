import { ReactElement } from 'react';
import { css } from '@emotion/core';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Input from '@icgc-argo/uikit/form/Input';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import MultiSelect, { Option } from '@icgc-argo/uikit/form/MultiSelect';
import Select from '@icgc-argo/uikit/form/Select';

import StaticApplicant from 'components/pages/Applications/PDF/StaticApplicant';
import FORM_TEXT from 'components/pages/Applications/PDF/textConstants';

import { countriesList, honorificsList } from './constants';
import DoubleFieldRow from './DoubleFieldRow';
import { FormFieldValidationTriggerFunction, FormSectionValidationState_Applicant } from './types';
import { isRequired } from './validations';
import { transformToSelectOptions } from './validations/helpers';
import { getStaticComponents } from '../../PDF/common';

const Applicant = ({
  isSectionDisabled,
  localState,
  validateFieldTouched,
}: {
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_Applicant;
  validateFieldTouched: FormFieldValidationTriggerFunction;
}): ReactElement => {
  const { SectionTitle } = getStaticComponents(false);
  return (
    <article>
      <StaticApplicant />

      <section>
        <SectionTitle>
          {FORM_TEXT.applicant.title}
        </SectionTitle>

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
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              placeholder="e.g. Jr., Sr., MD."
              value={localState.info_suffix?.value}
            />

            <FormHelperText onErrorOnly>{localState.info_suffix?.error?.[0]}</FormHelperText>
          </FormControl>
        </DoubleFieldRow>

        <DoubleFieldRow helpText="The legal entity responsible for this application.">
          <FormControl
            disabled={isSectionDisabled}
            error={!!localState.info_primaryAffiliation?.error}
            required={isRequired(localState.info_primaryAffiliation)}
          >
            <InputLabel htmlFor="info_primaryAffiliation">Primary Affiliation</InputLabel>

            <Input
              aria-label="Primary Affiliation"
              id="info_primaryAffiliation"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              value={localState.info_primaryAffiliation?.value}
            />

            <FormHelperText onErrorOnly>
              {localState.info_primaryAffiliation?.error?.[0]}
            </FormHelperText>
          </FormControl>
        </DoubleFieldRow>

        <DoubleFieldRow helpText="Must be the institutional email address of the Principal Investigator.">
          <FormControl
            disabled={isSectionDisabled}
            error={!!localState.info_institutionEmail?.error}
            required={isRequired(localState.info_institutionEmail)}
          >
            <InputLabel htmlFor="info_institutionEmail">Institutional Email</InputLabel>

            <Input
              aria-label="Institutional Email"
              id="info_institutionEmail"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              value={localState.info_institutionEmail?.value}
            />

            <FormHelperText onErrorOnly>
              {localState.info_institutionEmail?.error?.[0]}
            </FormHelperText>
          </FormControl>
        </DoubleFieldRow>

        <DoubleFieldRow helpText="Must be the Gmail or G Suite email address of the Principal Investigator.">
          <FormControl
            disabled={isSectionDisabled}
            error={!!localState.info_googleEmail?.error}
            required={isRequired(localState.info_googleEmail)}
          >
            <InputLabel htmlFor="info_googleEmail">Google Email</InputLabel>

            <Input
              aria-label="Google Email"
              id="info_googleEmail"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              value={localState.info_googleEmail?.value}
            />

            <FormHelperText onErrorOnly>{localState.info_googleEmail?.error?.[0]}</FormHelperText>
          </FormControl>
        </DoubleFieldRow>

        <DoubleFieldRow helpText="Please provide a link to your profile on your institution/company website.">
          <FormControl
            disabled={isSectionDisabled}
            error={!!localState.info_website?.error}
            required={isRequired(localState.info_website)}
          >
            <InputLabel htmlFor="info_website">Researcher Profile URL</InputLabel>

            <Input
              aria-label="Institution/Company Website"
              id="info_website"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              value={localState.info_website?.value}
            />

            <FormHelperText onErrorOnly>{localState.info_website?.error?.[0]}</FormHelperText>
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
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value={localState.info_positionTitle?.value}
          />

          <FormHelperText onErrorOnly>{localState.info_positionTitle?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>

      <section>
        <SectionTitle>
          INSTITUTION/COMPANY MAILING ADDRESS
        </SectionTitle>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.address_country?.error}
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
            value={localState.address_country?.value ? [localState.address_country?.value] : []}
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
          disabled={isSectionDisabled}
          error={!!localState.address_building?.error}
          required={isRequired(localState.address_building)}
        >
          <InputLabel htmlFor="address_building">Building</InputLabel>

          <Input
            aria-label="Building, e.g. MaRS Centre, South Tower"
            id="address_building"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            placeholder="e.g. MaRS Centre, South Tower"
            value={localState.address_building?.value}
          />

          <FormHelperText onErrorOnly>{localState.address_building?.error?.[0]}</FormHelperText>
        </FormControl>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.address_streetAddress?.error}
          required={isRequired(localState.address_streetAddress)}
        >
          <InputLabel htmlFor="address_streetAddress">Street Address</InputLabel>

          <Input
            aria-label="Street Address, e.g. 101 College Street, Suite 800"
            id="address_streetAddress"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            placeholder="e.g. 101 College Street, Suite 800"
            value={localState.address_streetAddress?.value}
          />

          <FormHelperText onErrorOnly>
            {localState.address_streetAddress?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.address_cityAndProvince?.error}
          required={isRequired(localState.address_cityAndProvince)}
        >
          <InputLabel htmlFor="address_cityAndProvince">City and Province/State</InputLabel>

          <Input
            aria-label="City and Province/State"
            id="address_cityAndProvince"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            placeholder="e.g. Toronto, Ontario"
            value={localState.address_cityAndProvince?.value}
          />

          <FormHelperText onErrorOnly>
            {localState.address_cityAndProvince?.error?.[0]}
          </FormHelperText>
        </FormControl>

        <FormControl
          disabled={isSectionDisabled}
          error={!!localState.address_postalCode?.error}
          required={isRequired(localState.address_postalCode)}
        >
          <InputLabel htmlFor="address_postalCode">Postal/Zip Code</InputLabel>

          <Input
            aria-label="Postal/Zip Code"
            id="address_postalCode"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value={localState.address_postalCode?.value}
          />

          <FormHelperText onErrorOnly>{localState.address_postalCode?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default Applicant;
