import { ReactElement, useCallback, useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';
import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { ContentBody, ContentBox } from '@icgc-argo/uikit/PageLayout';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';

import { sectionsOrder } from './constants';
import { enabledSections, sectionSelector } from './helpers';
import Outline from './Outline';
import { FormSectionNames, FORM_STATES } from './types';
import { useFormValidation } from './validations';

type QueryType = {
  query: {
    section?: FormSectionNames;
  };
};

const ApplicationFormsBase = ({ appId = 'none' }): ReactElement => {
  const {
    query: { section: sectionFromQuery = '' as FormSectionNames },
  }: QueryType = useRouter();
  const isValidSectionFromQuery = sectionsOrder.includes(sectionFromQuery);
  const [selectedSection, setSelectedSection] = useState(
    isValidSectionFromQuery
      ? sectionFromQuery
      : (sectionFromQuery &&
          console.info('Section initially queried was not found', sectionFromQuery),
        sectionsOrder[0] as FormSectionNames),
  );
  const { isLoading, formState, validateSection } = useFormValidation(appId);
  const theme: UikitTheme = useTheme();

  useEffect(() => {
    // This adds the selected section to the history
    // without the initial switch when it's not in the query
    (sectionFromQuery ? router.push : router.replace)(
      `/applications/${appId}?section=${selectedSection}`,
      undefined,
      {
        shallow: true,
      },
    );
  }, [selectedSection]);

  const sectionIndex = sectionsOrder.indexOf(selectedSection);
  const sectionsAfter = enabledSections(sectionsOrder.slice(sectionIndex + 1), formState);
  const sectionsBefore = enabledSections(sectionsOrder.slice(0, sectionIndex), formState);

  const handleSectionChange = useCallback(
    (section: FormSectionNames) => {
      ['', FORM_STATES.DISABLED, FORM_STATES.PRISTINE].includes(
        formState.sections[selectedSection]?.overall || '',
      ) || validateSection(selectedSection, !!'validateSelectedSection')();

      setSelectedSection(section);
    },
    [selectedSection, formState],
  );

  const handlePreviousNextSectionClick = (direction: 'next' | 'previous') => () => {
    handleSectionChange(
      direction === 'next'
        ? sectionsAfter[0] // next <<available>>
        : sectionsBefore.slice(-1)[0], // previous <<available>>
    );
  };

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
          setSelectedSection={handleSectionChange}
          formState={formState}
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
              padding: 30px 40px 40px;

              h2 {
                font-size: 20px;
                margin-top: 0;
              }

              > section {
                &:not(:first-of-type) {
                  border-top: 1px solid ${theme.colors.grey_2};

                  &:not(:last-of-type) {
                    padding-bottom: 25px;
                  }
                }

                p {
                  margin: 0;

                  & + [class*='FormControl'] {
                    margin-top: 10px;

                    &.closer {
                      margin-top: 13px;
                    }
                  }

                  &:not(:last-of-type) {
                    margin-bottom: 23px;

                    & + [class*='FormControl'].closer {
                      margin-top: -10px;
                    }
                  }

                  + [class*='DoubleFieldRow'],
                  + [class*='FormControl'] {
                    margin-top: 20px;
                  }
                }

                // for the horizontal design in this app
                [class*='FormControl'] {
                  width: 100%;

                  > label {
                    line-height: 1rem;

                    & ~ p {
                      margin-top: 5px 0 0;
                    }
                  }

                  &.vertical {
                    margin-bottom: 20px;
                  }

                  &:not(.vertical) {
                    align-items: center;
                    display: flex;
                    flex-wrap: wrap;

                    > label {
                      margin: 0 5px 0 0;
                      flex-shrink: 0;
                      width: 140px;

                      & ~ p {
                        margin-left: 150px;
                      }
                    }

                    > div {
                      flex-grow: 1;
                    }

                    > p {
                      flex-basis: 100%;
                    }

                    + p {
                      margin-top: 30px;
                    }
                  }

                  textarea {
                    font-size: 12px;
                    line-height: 13px;
                  }
                }

                [class*='DoubleFieldRow'] {
                  margin-bottom: 10px;

                  [class*='FormControl'] {
                    margin-bottom: 0;
                  }
                }
              }
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

          {sectionSelector({
            formState,
            isLoading,
            selectedSection,
            validator: validateSection,
          })}

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
