import { css } from '@emotion/core';
import FormCheckbox from '@icgc-argo/uikit/form/FormCheckbox';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Input from '@icgc-argo/uikit/form/Input';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Link from '@icgc-argo/uikit/Link';
import MultiSelect, { Option } from '@icgc-argo/uikit/form/MultiSelect';
import Select from '@icgc-argo/uikit/form/Select';
import Typography from '@icgc-argo/uikit/Typography';

import { countriesList, honorificsList } from './constants';
import DoubleFieldRow from './DoubleFieldRow';
import RequiredFieldsMessage from './RequiredFieldsMessage';
import {
  FormSectionValidationState_Representative,
  FormSectionValidatorFunction_Origin,
} from './types';
import { useLocalValidation } from './validations';
import { transformToSelectOptions } from './validations/helpers';

const Representative = ({
  isSectionDisabled,
  storedFields,
  validateSection,
}: {
  isSectionDisabled: boolean;
  storedFields: FormSectionValidationState_Representative;
  validateSection: FormSectionValidatorFunction_Origin;
}) => {
  const {
    localState,
    validateFieldTouched,
  }: {
    localState: FormSectionValidationState_Representative;
    validateFieldTouched: (event: any) => void;
  } = useLocalValidation(storedFields, validateSection('representative'));

  return (
    <article>
      <Typography bold component="h2">
        B. Institutional Representative
      </Typography>

      <section>
        <Typography>
          An Institutional Representative is a qualified representative of a legal entity{' '}
          <Typography as="span" bold>
            who has the administrative power to legally commit that entity to the terms and
            conditions of the{' '}
            <Link href="#" target="_blank">
              Data Access Agreement
            </Link>
          </Typography>{' '}
          (e.g. Vice-President Research, a Research Director, or a Contracts Officer for the
          entity).
        </Typography>

        <Typography>
          The Institutional Representative’s signature will be required at the end of this
          application before being reviewed by ICGC DACO.
        </Typography>

        <RequiredFieldsMessage />
      </section>

      <section>
        <Typography bold component="h3" color="secondary">
          INSTITUTIONAL REPRESENTATIVE INFORMATION
        </Typography>

        <DoubleFieldRow>
          <FormControl error={!!localState.info_title?.error}>
            <InputLabel htmlFor="info_title">Title</InputLabel>

            <Select
              aria-label="Title"
              disabled={isSectionDisabled}
              id="info_title"
              onBlur={validateFieldTouched}
              eventOnChange={validateFieldTouched}
              options={transformToSelectOptions(honorificsList)}
              value={localState.info_title?.value}
            />

            <FormHelperText onErrorOnly>{localState.info_title?.error?.[0]}</FormHelperText>
          </FormControl>
          &nbsp;
        </DoubleFieldRow>

        <DoubleFieldRow>
          <FormControl error={!!localState.info_firstName?.error} required>
            <InputLabel htmlFor="info_firstName">First Name</InputLabel>

            <Input
              aria-label="First Name"
              disabled={isSectionDisabled}
              id="info_firstName"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              value={localState.info_firstName?.value}
            />

            <FormHelperText onErrorOnly>{localState.info_firstName?.error?.[0]}</FormHelperText>
          </FormControl>

          <FormControl error={!!localState.info_middleName?.error}>
            <InputLabel htmlFor="info_middleName">Middle Name</InputLabel>

            <Input
              aria-label="Middle Name"
              disabled={isSectionDisabled}
              id="info_middleName"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              value={localState.info_middleName?.value}
            />

            <FormHelperText onErrorOnly>{localState.info_middleName?.error?.[0]}</FormHelperText>
          </FormControl>
        </DoubleFieldRow>

        <DoubleFieldRow>
          <FormControl error={!!localState.info_lastName?.error} required>
            <InputLabel htmlFor="info_lastName">Last Name</InputLabel>

            <Input
              aria-label="Last Name"
              disabled={isSectionDisabled}
              id="info_lastName"
              onBlur={validateFieldTouched}
              onChange={validateFieldTouched}
              value={localState.info_lastName?.value}
            />

            <FormHelperText onErrorOnly>{localState.info_lastName?.error?.[0]}</FormHelperText>
          </FormControl>

          <FormControl error={!!localState.info_suffix?.error}>
            <InputLabel htmlFor="info_suffix">Suffix</InputLabel>

            <Input
              aria-label="Suffix, e.g. Jr., Sr., MD."
              disabled={isSectionDisabled}
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
          <FormControl error={!!localState.info_primaryAffiliation?.error} required>
            <InputLabel htmlFor="info_primaryAffiliation">Primary Affiliation</InputLabel>

            <Input
              aria-label="Primary Affiliation"
              disabled={isSectionDisabled}
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
          <FormControl error={!!localState.info_institutionEmail?.error} required>
            <InputLabel htmlFor="info_institutionEmail">Institutional Email</InputLabel>

            <Input
              aria-label="Institutional Email"
              disabled={isSectionDisabled}
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

        <FormControl error={!!localState.info_positionTitle?.error} required>
          <InputLabel htmlFor="info_positionTitle">Position Title</InputLabel>

          <Input
            aria-label="Position Title"
            disabled={isSectionDisabled}
            id="info_positionTitle"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value={localState.info_positionTitle?.value}
          />

          <FormHelperText onErrorOnly>{localState.info_positionTitle?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>

      <section>
        <Typography bold component="h3" color="secondary">
          INSTITUTION/COMPANY MAILING ADDRESS
        </Typography>

        <FormControl>
          <FormCheckbox
            aria-label="Address is the same as the Applicant."
            disabled={isSectionDisabled}
            // checked={false}
            onChange={() => {}}
            value="copyApplicantMailing"
          >
            Address is the same as the Applicant.
          </FormCheckbox>

          <FormHelperText onErrorOnly>{localState.agreement_accepted?.error?.[0]}</FormHelperText>
        </FormControl>

        <FormControl error={!!localState.address_country?.error} required>
          <InputLabel htmlFor="address_country">Country</InputLabel>

          <MultiSelect
            aria-label="Country"
            css={css`
              > ol {
                max-height: 200px;
                overflow: auto;
              }
            `}
            disabled={isSectionDisabled}
            id="address_country"
            name="address_country"
            onChange={validateFieldTouched}
            onBlur={validateFieldTouched}
            single
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

        <FormControl error={!!localState.address_building?.error}>
          <InputLabel htmlFor="address_building">Building</InputLabel>

          <Input
            aria-label="Building, e.g. MaRS Centre, South Tower"
            disabled={isSectionDisabled}
            id="address_building"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            placeholder="e.g. MaRS Centre, South Tower"
            value={localState.address_building?.value}
          />

          <FormHelperText onErrorOnly>{localState.address_building?.error?.[0]}</FormHelperText>
        </FormControl>

        <FormControl error={!!localState.address_street?.error} required>
          <InputLabel htmlFor="address_street">Street Address</InputLabel>

          <Input
            aria-label="Street Address, e.g. 101 College Street, Suite 800"
            disabled={isSectionDisabled}
            id="address_street"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            placeholder="e.g. 101 College Street, Suite 800"
            value={localState.address_street?.value}
          />

          <FormHelperText onErrorOnly>{localState.address_street?.error?.[0]}</FormHelperText>
        </FormControl>

        <FormControl error={!!localState.address_cityAndProvince?.error} required>
          <InputLabel htmlFor="address_cityAndProvince">City and Province/State</InputLabel>

          <Input
            aria-label="City and Province/State"
            disabled={isSectionDisabled}
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

        <FormControl error={!!localState.address_postalCode?.error} required>
          <InputLabel htmlFor="address_postalCode">Postal/Zip Code</InputLabel>

          <Input
            aria-label="Postal/Zip Code"
            disabled={isSectionDisabled}
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

export default Representative;
