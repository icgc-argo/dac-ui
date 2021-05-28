import { ReactElement, useState } from 'react';
import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { ContentBody, ContentBox } from '@icgc-argo/uikit/PageLayout';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';

import { sectionsOrder } from './constants';
import Outline from './Outline';
import { FormSectionNames } from './types';
import { useFormValidation, ValidationParametersType } from './useFormValidation';

const enabledSections = (sections: FormSectionNames[], state: ValidationParametersType) =>
  sections.filter((sectionName) => !(state[sectionName]?.overall === 'disabled'));

const ApplicationFormsBase = (): ReactElement => {
  const [selectedSection, setSelectedSection] = useState(sectionsOrder[0] as FormSectionNames);
  const theme: UikitTheme = useTheme();
  const { validationState } = useFormValidation();

  const sectionIndex = sectionsOrder.indexOf(selectedSection);
  const sectionsAfter = enabledSections(sectionsOrder.slice(sectionIndex + 1), validationState);
  const sectionsBefore = enabledSections(sectionsOrder.slice(0, sectionIndex), validationState);

  const handlePreviousNextSectionClick = (direction: 'next' | 'previous') => () =>
    setSelectedSection(
      direction === 'next'
        ? sectionsAfter[0] // next <<available>>
        : sectionsBefore.slice(-1)[0], // previous <<available>>
    );

  return (
    <ContentBody>
      <ContentBox
        css={css`
          box-sizing: border-box;
          display: flex;
          margin: 10px auto;
          max-width: 1200px;
          min-width: 665px;
          width: 100%;
        `}
      >
        <Outline
          sections={sectionsOrder}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          validationState={validationState as Record<FormSectionNames, any>}
        />

        <div
          css={css`
            border-radius: 0 8px 8px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: -8px 0;
            margin-right: -8px;
            min-width: 460px;
            width: 100%;

            > article {
              height: 100%;
              padding: 30px 40px;
            }
          `}
        >
          <header
            css={css`
              align-items: center;
              border-bottom: 1px solid ${theme.colors.grey_2};
              display: flex;
              min-height: 45px;
              padding: 0 40px;
            `}
          >
            <Typography
              component="h1"
              css={css`
                margin: 0;
              `}
              variant="subtitle"
            >
              <Icon
                css={css`
                  margin-bottom: -5px;
                  margin-right: 8px;
                `}
                fill={theme.colors.secondary}
                name="form"
              />
              Application for Controlled Data Access
            </Typography>
          </header>

          <article>
            {selectedSection} placeholder
          </article>

          <footer
            css={css`
              align-items: center;
              border-top: 1px solid ${theme.colors.grey_2};
              display: flex;
              justify-content: space-between;
              min-height: 45px;
              padding: 0 40px;
            `}
          >
            {sectionsBefore.length > 0 && (
              <Button onClick={handlePreviousNextSectionClick('previous')} size="sm">
                <Icon fill={theme.colors.white} height="9px" name="chevron_left" /> Previous Section
              </Button>
            )}

            <>&nbsp;</>

            {sectionsAfter.length > 0 && (
              <Button onClick={handlePreviousNextSectionClick('next')} size="sm">
                Next Section <Icon fill={theme.colors.white} height="9px" name="chevron_right" />
              </Button>
            )}
          </footer>
        </div>
      </ContentBox>
    </ContentBody>
  );
};

export default ApplicationFormsBase;
