import Banner, { BANNER_VARIANTS } from '@icgc-argo/uikit/notifications/Banner';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import FormRadio from '@icgc-argo/uikit/form/FormRadio';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Link from '@icgc-argo/uikit/Link';
import RadioCheckboxGroup from '@icgc-argo/uikit/form/RadioCheckboxGroup';
import Typography from '@icgc-argo/uikit/Typography';

import RequiredFieldsMessage from './RequiredFieldsMessage';
import {
  FormSectionValidationState_EthicsLetter,
  FormSectionValidatorFunction_Origin,
} from './types';
import { isRequired, useLocalValidation } from './validations';
import { css } from '@emotion/core';

const EthicsLetter = ({
  isSectionDisabled,
  storedFields,
  validateSection,
}: {
  isSectionDisabled: boolean;
  storedFields: FormSectionValidationState_EthicsLetter;
  validateSection: FormSectionValidatorFunction_Origin;
}) => {
  const {
    localState,
    validateFieldTouched,
  }: {
    localState: FormSectionValidationState_EthicsLetter;
    validateFieldTouched: (event: any) => void;
  } = useLocalValidation(storedFields, validateSection('introduction'));

  return (
    <article>
      <Typography bold component="h2">
        E. Ethics
      </Typography>

      <section>
        <Typography>
          ICGC is aware that some countries/regions do not require ethics approval for use of coded
          data (i.e. use of the ICGC Controlled Data). Depending on the nature of your Research
          Project, it is possible, however, that such approval is needed in your country. If you are
          uncertain as to whether your Research Project needs ethics approval to use ICGC Controlled
          Data, we suggest you contact your local institutional review board / research ethics
          committee (IRB/REC) to clarify the matter.
        </Typography>

        <Banner
          css={css`
            margin-top: 15px;
          `}
          content={
            <Typography>
              <Typography bold component="span">
                Please note:
              </Typography>{' '}
              The DACO and the ICGC are not responsible for the ethics approval/monitoring of
              individual Research Projects and bear no responsibility for the applicant's failure to
              comply with local/national ethical requirements.
            </Typography>
          }
          size="SM"
          variant={BANNER_VARIANTS.WARNING}
        />

        <RequiredFieldsMessage />
      </section>

      <section>
        <Typography bold component="h3" color="secondary">
          ETHICS APPROVAL
        </Typography>

        <FormControl
          className="vertical"
          error={!!localState.declaredAsRequired?.error}
          required={true}
          // required={isRequired(localState.declaredAsRequired)}
        >
          <InputLabel htmlFor="declaredAsRequired">
            Please choose one of the following options
          </InputLabel>

          <RadioCheckboxGroup
            css={css`
              margin-top: 15px;
            `}
            isChecked={false}
            onChange={function noRefCheck() {}}
          >
            <FormRadio value="one" checked>
              You represent and warrant that your country/region does not require your Research
              Project to undergo ethics review.
            </FormRadio>
            <FormRadio disabled value="two">
              Your country/region requires your Research Project to undergo ethics review, and
              therefore, this Research Project has been approved by an IRB/REC formally designated
              to approve and/or monitor research involving humans.{' '}
              <Typography bold component="span">
                As per the{' '}
                <Link href="#" rel="noopener noreferrer" target="_blank">
                  Data Access Agreement
                </Link>
                , current and applicable ethical approval is the responsibility of the Principal
                Investigator.
              </Typography>
            </FormRadio>
          </RadioCheckboxGroup>

          <FormHelperText onErrorOnly>{localState.declaredAsRequired?.error?.[0]}</FormHelperText>
        </FormControl>
      </section>
    </article>
  );
};

export default EthicsLetter;
