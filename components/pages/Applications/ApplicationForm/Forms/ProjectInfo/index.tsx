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
      <Typography bold component="h2">
        D. Project Information
      </Typography>

      <section>
        <Typography>
          Please fill out the following details for your research project, including the website url
          if available.
        </Typography>

        <RequiredFieldsMessage />
      </section>

      <section>
        <Typography bold component="h3" color="secondary">
          BASIC INFORMATION
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
        <Typography bold component="h3" color="secondary">
          RESEARCH SUMMARY - SCIENTIFIC ABSTRACT
        </Typography>

        <Typography>
          This section should describe the{' '}
          <Typography as="span" bold>
            background, aims, and methodology
          </Typography>{' '}
          of your research project, as well as plans for{' '}
          <Typography as="span" bold>
            how you will use the ICGC Controlled Data.
          </Typography>
        </Typography>

        <FormControl
          className="vertical"
          error={!!localState.background?.error}
          required={isRequired(localState.background)}
        >
          <InputLabel htmlFor="background">Background (max. 200 words)</InputLabel>
          <FormFieldHelpBubble
            text={
              <>
                Provide a short summary of the background basis of your research. For example,
                <ul>
                  <li>What founding research is your project based on?</li>
                  <li>
                    If possible, include any previous research in this area that you have completed
                    that is relevant.
                  </li>
                </ul>
              </>
            }
          />

          <Textarea
            aria-label="Background (max. 200 words)"
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
          <InputLabel htmlFor="aims">Aims (max. 200 words)</InputLabel>
          <FormFieldHelpBubble
            text={
              <>
                Provide a summary of what your project hopes to achieve using the ICGC Controlled
                Data. For example:
                <ul>
                  <li>
                    How will your research impact health research or biological understanding?
                  </li>
                  <li>What are some planned outputs for your research project?</li>
                </ul>
              </>
            }
          />

          <Textarea
            aria-label="Aims (max. 200 words)"
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
          <InputLabel htmlFor="aims">Use for Data and Methodology (max. 200 words)</InputLabel>
          <FormFieldHelpBubble
            text={
              <>
                Provide a summary of the methods for your research project and the plans for data
                usage, including:
                <ul>
                  <li>
                    What major methods and technologies will you use (in-depth methodology is not
                    required)?
                  </li>
                  <li>How exactly will the ICGC Controlled Data be used?</li>
                  <li>
                    <Typography as="span" bold>
                      Please note:
                    </Typography>{' '}
                    If you are planning on combining ICGC controlled data with other datasets, as
                    per{' '}
                    <Link href="#" rel="noopener noreferrer" target="_blank">
                      Term 5 of the Data Access Agreement (DAA)
                    </Link>
                    , you agree not to link or combine the ICGC Controlled Data to other data
                    available in a way that could re-identify the Research Participants.{' '}
                    <Typography as="span" bold>
                      Please confirm how the methods you intend to use to combine datasets will
                      minimize the risk for re-identification of the ICGC data donors
                    </Typography>
                    .
                  </li>
                </ul>
              </>
            }
          />

          <Textarea
            aria-label="Use for Data and Methodology (max. 200 words)"
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
        <Typography bold component="h3" color="secondary">
          PROJECT LAY SUMMARY
        </Typography>

        <Typography>
          The lay summaries of ICGC DACO approved projects are posted on the{' '}
          <Link href="#" rel="noopener noreferrer" target="_blank">
            ICGC ARGO website
          </Link>
          .
        </Typography>

        <FormControl
          className="vertical"
          error={!!localState.summary?.error}
          required={isRequired(localState.summary)}
        >
          <InputLabel htmlFor="summary">Lay Summary (max. 200 words)</InputLabel>
          <FormFieldHelpBubble
            text={
              <>
                Provide a short project summary targeted towards the general public, including ICGC
                data donors.
                <ul>
                  <li>
                    Describe your project as if you were describing to a friend who is not an
                    expert.
                  </li>
                  <li>
                    Scientific terminology such as "germline," "non-coding regions," "somatic," and
                    "whole-genome/whole- exome/next-generation sequencing" should therefore be
                    described or defined in lay terms.
                  </li>
                  <li>
                    In addition to explaining the background and objectives of your research
                    project,{' '}
                    <Typography as="span" bold>
                      please clearly explain how the ICGC Controlled Data will be used
                    </Typography>
                    .
                  </li>
                </ul>
              </>
            }
          />

          <Textarea
            aria-label="Lay Summary  (max. 200 words)"
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
