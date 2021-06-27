import { ReactElement } from 'react';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Input from '@icgc-argo/uikit/form/Input';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Link from '@icgc-argo/uikit/Link';
import Textarea from '@icgc-argo/uikit/form/Textarea';
import Typography from '@icgc-argo/uikit/Typography';

import FormFieldHelpBubble from '../FormFieldHelpBubble';
import RequiredFieldsMessage from '../RequiredFieldsMessage';
import {
  FormSectionValidationState_ProjectInfo,
  FormSectionValidatorFunction_Origin,
} from '../types';
import { isRequired, useLocalValidation } from '../validations';
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
import { css } from '@icgc-argo/uikit';

const ProjectInfo = ({
  isSectionDisabled,
  storedFields,
  validateSection,
}: {
  isSectionDisabled: boolean;
  storedFields: FormSectionValidationState_ProjectInfo;
  validateSection: FormSectionValidatorFunction_Origin;
}): ReactElement => {
  const {
    localState,
    validateFieldTouched,
  }: {
    localState: FormSectionValidationState_ProjectInfo;
    validateFieldTouched: (event: any) => void;
  } = useLocalValidation(storedFields, validateSection('projectInfo'));

  return (
    <article>
      <StaticProjectInfo />

      <section>
        <Typography bold component="h3" color="secondary">
          {FORM_TEXT.project_info.basic_info}
        </Typography>

        <FormControl error={!!localState.title?.error} required={isRequired(localState.title)}>
          <InputLabel htmlFor="title">Project Title</InputLabel>

          <Input
            aria-label="Project Title"
            disabled={isSectionDisabled}
            id="title"
            onBlur={validateFieldTouched}
            onChange={validateFieldTouched}
            value={localState.title?.value}
          />

          <FormHelperText onErrorOnly>{localState.title?.error?.[0]}</FormHelperText>
        </FormControl>

        <FormControl error={!!localState.website?.error} required={isRequired(localState.website)}>
          <InputLabel htmlFor="website">Project Website</InputLabel>

          <Input
            aria-label="Project Website"
            disabled={isSectionDisabled}
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
          error={!!localState.background?.error}
          required={isRequired(localState.background)}
        >
          <InputLabel htmlFor="background">
            {FORM_TEXT.project_info.inputLabel.background}
          </InputLabel>
          <FormFieldHelpBubble text={<BackgroundBubble />} />

          <Textarea
            aria-label={FORM_TEXT.project_info.inputLabel.background}
            countLimit={200}
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
          error={!!localState.aims?.error}
          required={isRequired(localState.aims)}
        >
          <InputLabel htmlFor="aims">{FORM_TEXT.project_info.inputLabel.aims}</InputLabel>
          <FormFieldHelpBubble text={<AimsBubble />} />

          <Textarea
            aria-label={FORM_TEXT.project_info.inputLabel.aims}
            countLimit={200}
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
          error={!!localState.methodology?.error}
          required={isRequired(localState.methodology)}
        >
          <InputLabel htmlFor="aims">{FORM_TEXT.project_info.inputLabel.dataUse}</InputLabel>
          <FormFieldHelpBubble text={<DataUseBubble />} />

          <Textarea
            aria-label={FORM_TEXT.project_info.inputLabel.dataUse}
            countLimit={200}
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
          error={!!localState.summary?.error}
          required={isRequired(localState.summary)}
        >
          <InputLabel htmlFor="summary">{FORM_TEXT.project_info.inputLabel.laySummary}</InputLabel>
          <FormFieldHelpBubble text={<LaySummaryBubble />} />

          <Textarea
            aria-label={FORM_TEXT.project_info.inputLabel.laySummary}
            countLimit={200}
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
        {...localState.publicationURLs}
        isSectionDisabled={isSectionDisabled}
        validateFieldTouched={validateFieldTouched}
      />
    </article>
  );
};

export default ProjectInfo;
