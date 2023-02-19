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

import { ReactElement, useCallback, useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';
import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import { UikitTheme } from '@icgc-argo/uikit/index';
import { ContentBody, ContentBox } from '@icgc-argo/uikit/PageLayout';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';
import Notification from '@icgc-argo/uikit/notifications/Notification';

import { sectionsOrder } from './constants';
import { enabledSections, sectionSelector } from './helpers';
import Outline from './Outline';
import {
  FormSectionNames,
  FormSectionValidationTriggerReasons,
  FormSectionValidatorFunction_Origin,
  FormValidationStateParameters,
  FORM_STATES,
} from './types';
import { SUBMISSION_SUCCESS_CHECK, APPROVED_APP_CLOSED_CHECK } from 'global/constants';
import { ApplicationData, ApplicationState } from 'components/pages/Applications/types';
import { getConfig } from 'global/config';
import Link from '@icgc-argo/uikit/Link';
import ApplicationHistoryModal from './ApplicationHistoryModal';
import { SetLastUpdated } from '../types';
import { format } from 'date-fns';
import { DATE_TEXT_FORMAT } from 'global/constants';

import { AxiosError } from 'axios';
import { useAuthContext } from 'global/hooks';
import urlJoin from 'url-join';
import { API, APPLICATIONS_PATH } from 'global/constants';

enum VisibleModalOption {
  NONE = 'NONE',
  APPLICATION_HISTORY = 'APPLICATION_HISTORY',
}

type QueryType = {
  query: {
    section?: FormSectionNames;
  };
};

const notificationStyle = css`
  margin: 0 auto 25px auto;
  max-width: 1200px;
  min-width: 665px;
  width: 100%;
`;

const getActiveSection = (sectionFromQuery?: FormSectionNames): FormSectionNames => {
  if (!sectionFromQuery) return sectionsOrder[0];
  const isValidSectionFromQuery = sectionsOrder.includes(sectionFromQuery);

  return isValidSectionFromQuery
    ? sectionFromQuery
    : ((sectionFromQuery &&
        console.info('Section initially queried was not found', sectionFromQuery),
      sectionsOrder[0]) as FormSectionNames);
};

const ApplicationFormsBase = ({
  appId = 'none',
  applicationState,
  setLastUpdated,
  isLoading,
  formState,
  validateSection,
  sectionData,
  isAttestable,
  attestedAtUtc,
  attestationByUtc = '',
  isAdmin,
  refetchAllData,
}: {
  appId: string;
  applicationState: ApplicationState;
  setLastUpdated: SetLastUpdated;
  isLoading: boolean;
  formState: FormValidationStateParameters;
  validateSection: FormSectionValidatorFunction_Origin;
  sectionData: ApplicationData['sections'];
  isAttestable: boolean;
  attestedAtUtc?: string;
  attestationByUtc?: string;
  isAdmin: boolean;
  refetchAllData: any;
}): ReactElement => {
  const [visibleModal, setVisibleModal] = useState<VisibleModalOption>(VisibleModalOption.NONE);
  const [showSuccessfulAttestation, setShowSuccessfulAttestation] = useState(false);
  const { fetchWithAuth } = useAuthContext();
  const { NEXT_PUBLIC_DACO_SURVEY_URL } = getConfig();

  const {
    query: { section: sectionFromQuery = '' as FormSectionNames },
  }: QueryType = useRouter();
  const [selectedSection, setSelectedSection] = useState(getActiveSection(sectionFromQuery));

  useEffect(() => {
    setSelectedSection(getActiveSection(sectionFromQuery));
  }, [sectionFromQuery]);

  const theme: UikitTheme = useTheme();

  const triggerSectionValidation = useCallback(
    (trigger: FormSectionValidationTriggerReasons, section: FormSectionNames) =>
      ['', FORM_STATES.DISABLED, FORM_STATES.PRISTINE].includes(
        formState.sections[section]?.meta.overall || '',
      ) || validateSection(section, trigger)(),
    [formState],
  );

  useEffect(() => {
    if (sectionFromQuery !== selectedSection) {
      // This adds the selected section to the history
      // without the initial switch when it's not in the query
      (sectionFromQuery ? router.push : router.replace)(
        `/applications/${appId}?section=${selectedSection}`,
        undefined,
        {
          shallow: true,
        },
      );
    }

    // avoid validating a section that has already been validated.
    formState.sections[selectedSection]?.meta.validated ||
      triggerSectionValidation('initialValidation', selectedSection);
  }, [formState.sections[selectedSection], selectedSection]);

  useEffect(() => {
    if (formState.lastUpdatedAtUtc) {
      setLastUpdated(formState.lastUpdatedAtUtc);
    }

    selectedSection === 'collaborators'
      ? formState.sections[selectedSection]?.meta.showOverall ||
        triggerSectionValidation('notShowingOverall', selectedSection)
      : sectionsOrder.forEach(
          (section) =>
            // validates all other section that doen't already show overall status.
            !(formState.sections[section]?.meta.showOverall || selectedSection === section) &&
            triggerSectionValidation('notShowingOverall', section),
        );
  }, [formState.lastUpdatedAtUtc]);

  useEffect(() => {
    refetchAllData();
  }, [appId]);

  const sectionIndex = sectionsOrder.indexOf(selectedSection);
  const sectionsAfter = enabledSections(sectionsOrder.slice(sectionIndex + 1), formState);
  const sectionsBefore = enabledSections(sectionsOrder.slice(0, sectionIndex), formState);

  const requiresAttestation = !attestedAtUtc && isAttestable;

  const handleSectionChange = useCallback(
    (section: FormSectionNames) => {
      if (section !== selectedSection) {
        setSelectedSection(section);

        // only validates a section that doesn't already show its overall status.
        formState.sections[selectedSection]?.meta.showOverall ||
          triggerSectionValidation('notShowingOverall', selectedSection);
      }
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

  const handleSubmitAttestion = () => {
    fetchWithAuth({
      data: {
        isAttesting: true,
      },
      method: 'PATCH',
      url: urlJoin(API.APPLICATIONS, appId),
    })
      .then(() => {
        setShowSuccessfulAttestation(true);
        refetchAllData();
        router.push(`${APPLICATIONS_PATH}/${appId}?section=terms`);
      })
      .catch((err: AxiosError) => {
        console.error('Failed to submit.', err);
      });
  };

  return (
    <>
      <ContentBody>
        {requiresAttestation && !isAdmin && (
          <Notification
            title={
              <div
                css={css`
                  margin-top: 8px;
                  margin-left: 10px;
                `}
              >
                {`Annual Attestation is required by ${format(
                  new Date(attestationByUtc),
                  DATE_TEXT_FORMAT,
                )} or access will be paused`}
              </div>
            }
            content={
              <div
                css={css`
                  margin-top: 20px;
                  margin-left: 10px;
                  margin-bottom: 20px;
                `}
              >
                <span>
                  At every one year interval you must confirm your ongoing compliance with the ICGC
                  ARGO Data Access Agreement and ICGC ARGO Policies. Specifically:
                </span>
                <br />
                <br />
                <span>
                  1. I agree not to attempt to identify individuals represented in the dataset.
                </span>
                <br />
                <span>
                  2. My use of the data will be consistent with the ICGC ARGO Data Access Policy and
                  Publication Policy.
                </span>
                <br />
                <span>
                  3. Only authorized personnel will access the data and any changes to authorized
                  personnel will be reported to the ICGC DACO team immediately.
                </span>
                <br />
                <span>
                  4. I will comply with all ethical and regulatory requirements applicable within my
                  institution and country/region in my use of the data.
                </span>
                <br />
                <br />
                <Button
                  css={css`
                    margin-top: 13px;
                    margin-bottom: 13px;
                  `}
                  size="sm"
                  onClick={handleSubmitAttestion}
                >
                  I ATTEST TO THE ABOVE TERMS
                </Button>
              </div>
            }
            interactionType="NONE"
            variant="WARNING"
            css={notificationStyle}
          />
        )}

        {showSuccessfulAttestation && (
          <Notification
            title="Your Annual Attestation has been Submitted"
            content="This project team will continue to have access to ICGC Controlled Data until the access expiry date."
            interactionType="CLOSE"
            variant="SUCCESS"
            onInteraction={({ type }) => {
              if (type === 'CLOSE') {
                setShowSuccessfulAttestation(false);
                router.push(`/applications/${appId}?section=${selectedSection}`);
              }
            }}
            css={notificationStyle}
          />
        )}

        {JSON.parse(localStorage.getItem(SUBMISSION_SUCCESS_CHECK) || 'false') &&
          [ApplicationState.REVIEW].includes(applicationState) && (
            <Notification
              title="Your Application has been Submitted"
              content="The ICGC DACO has been notified for review and you should hear back within ten business days regarding the status of your application."
              interactionType="CLOSE"
              variant="SUCCESS"
              onInteraction={({ type }) => {
                if (type === 'CLOSE') {
                  localStorage.setItem(SUBMISSION_SUCCESS_CHECK, 'false');
                  router.push(`/applications/${appId}?section=${selectedSection}`);
                }
              }}
              css={notificationStyle}
            />
          )}

        {JSON.parse(localStorage.getItem(APPROVED_APP_CLOSED_CHECK) || 'false') && (
          <Notification
            variant="SUCCESS"
            size="MD"
            interactionType="CLOSE"
            onInteraction={() => {
              localStorage.setItem(APPROVED_APP_CLOSED_CHECK, 'false');
              router.push(`/applications/${appId}?section=${selectedSection}`);
            }}
            title="Your Application has been Closed"
            content={
              <div
                css={css`
                  margin-top: 10px;
                `}
              >
                <span>
                  Access to ICGC Controlled Data will be removed for this project team within the
                  next 24 hours.
                </span>
                <br />
                <br />
                <strong>
                  You are required to complete a final report as per the conditions of the Data
                  Access Agreement.{' '}
                  <Link href={NEXT_PUBLIC_DACO_SURVEY_URL} target="_blank">
                    Click here to fill out the report
                  </Link>
                </strong>
                , describing your successes and challenges with accessing ICGC Controlled Data and
                the outcomes of your research project.
              </div>
            }
            css={notificationStyle}
          />
        )}
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

                    input:not([type]) {
                      // text inputs have no type
                      line-height: 32px;
                    }

                    [class*='Uikit-InputBox'] {
                      // remove padding on country box
                      padding: 0;
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
                justify-content: space-between;
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

              <Button
                css={css`
                  border: 0 none;
                  padding: 0;
                  &:hover {
                    background: transparent;
                    text-decoration: underline;
                  }
                `}
                onClick={() => {
                  setVisibleModal(VisibleModalOption.APPLICATION_HISTORY);
                }}
                variant="secondary"
              >
                <div
                  css={css`
                    align-items: center;
                    display: flex;
                  `}
                >
                  <Icon
                    css={css`
                      margin-right: 2px;
                    `}
                    fill={theme.colors.accent2_dark}
                    height="14px"
                    name="calendar"
                  />
                  <span>Application History</span>
                </div>
              </Button>
            </header>

            {sectionSelector({
              formState,
              isLoading,
              selectedSection,
              validator: validateSection,
              appId,
              sectionData,
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
                  <Icon fill={theme.colors.white} height="9px" name="chevron_left" /> Previous
                  Section
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
      {visibleModal === VisibleModalOption.APPLICATION_HISTORY && (
        <ApplicationHistoryModal
          appId={appId}
          onClose={() => setVisibleModal(VisibleModalOption.NONE)}
        />
      )}
    </>
  );
};

export default ApplicationFormsBase;
