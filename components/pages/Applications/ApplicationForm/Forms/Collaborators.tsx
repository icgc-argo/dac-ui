import Typography from '@icgc-argo/uikit/Typography';
import { css } from '@emotion/core';
import React, { ReactElement, useState } from 'react';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import Table from '@icgc-argo/uikit/Table';
import { Col, Row } from 'react-grid-system';
import pluralize from 'pluralize';
import { isEmpty } from 'lodash';
import ContentPlaceholder from '@icgc-argo/uikit/ContentPlaceholder';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

import StaticCollaborators from '../../PDF/StaticCollaborators';
import Modal from '@icgc-argo/uikit/Modal';
import { ModalPortal } from 'components/Root';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import Input from '@icgc-argo/uikit/form/Input';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import Select from '@icgc-argo/uikit/form/Select';
import { honorificsList } from './constants';
import DoubleFieldRow from './DoubleFieldRow';
import { isRequired } from './validations';
import { transformToSelectOptions } from './validations/helpers';
import RadioCheckboxGroup from '@icgc-argo/uikit/form/RadioCheckboxGroup';
import FormRadio from '@icgc-argo/uikit/form/FormRadio';
import { FormSectionValidationState_Applicant, FormFieldValidationTriggerFunction } from './types';
import { ApplicationState } from 'components/ApplicationProgressBar/types';

const Actions = ({ state }: { state: ApplicationState }) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        width: 100%;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
      `}
    >
      {!['APPROVED'].includes(state) && (
        <Icon name="edit" width="20px" height="20px" fill={theme.colors.accent2} />
      )}
      <Icon name="trash" width="19px" height="20px" />
    </div>
  );
};

const makeColumns = ({ state }: { state: ApplicationState }) => [
  {
    Header: 'Collaborator Type',
    accessor: 'positionTitle',
    id: 'positionTitle',
    width: 180,
  },
  {
    Header: 'First Name',
    accessor: 'firstName',
  },
  {
    Header: 'Last Name',
    accessor: 'lastName',
  },
  {
    Header: 'Institutional Email',
    accessor: 'institutionEmail',
    width: 170,
  },
  {
    Header: 'Google Email',
    accessor: 'googleEmail',
    width: 170,
  },
  {
    Header: 'Actions',
    width: 90,
    Cell: () => <Actions state={state} />,
  },
];

const mockCollaborators = [
  {
    positionTitle: 'Authorized Personnel',
    firstName: 'Taylor',
    lastName: 'Data',
    googleEmail: 't@gmail.com',
    institutionEmail: 't@example.com',
  },
  {
    positionTitle: 'Authorized Student',
    firstName: 'Lindsey',
    lastName: 'Smith',
    googleEmail: 'l@gmail.com',
    institutionEmail: 'l@example.com',
  },
];

enum CollaboratorType {
  PERSONNEL = 'PERSONNEL',
  STUDENT = 'STUDENT',
}

const Collaborators = ({
  isSectionDisabled,
  localState,
  state,
  validateFieldTouched,
}: {
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_Applicant;
  state: ApplicationState;
  validateFieldTouched: FormFieldValidationTriggerFunction;
}): ReactElement => {
  console.log('localState', localState);
  const [isModalVisible, setModalVisible] = useState(false);
  const [collaboratorType, setCollaboratorType] = useState(CollaboratorType.PERSONNEL);

  const dismissModal = () => setModalVisible(false);

  const containerRef = React.createRef<HTMLDivElement>();
  const theme = useTheme();

  return (
    <article>
      <StaticCollaborators />

      <section
        css={css`
          margin-top: 43px;
        `}
      >
        <div
          css={css`
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
          `}
        >
          <Typography variant="data">
            {mockCollaborators.length.toLocaleString()}{' '}
            {pluralize('Collaborators', mockCollaborators.length)}
          </Typography>
          <Button
            size="sm"
            css={css`
              display: flex;
              align-items: center;
            `}
            onClick={() => setModalVisible(true)}
          >
            <Icon
              name="plus_circle"
              fill="white"
              height="12px"
              css={css`
                position: relative;
                top: 2px;
                margin-right: 5px;
              `}
            />
            Add a collaborator{' '}
          </Button>
        </div>
        <Row
          css={css`
            margin-bottom: 8px;
          `}
        >
          <Col>
            {isEmpty(mockCollaborators) ? (
              <ContentPlaceholder
                title="You have not added any Collaborators."
                subtitle='To get started, click the "Add a collaborator" button above.'
                css={css`
                  padding-bottom: 26px;
                  border-bottom: 1px solid ${theme.colors.grey_2};
                  p {
                    font-size: 12px;
                    margin: 4px 0 0 0 !important;
                  }
                `}
              >
                <img src="/collaborators.webp" />
              </ContentPlaceholder>
            ) : (
              <Table
                css={css`
                  margin-top: 9px;
                `}
                showPagination={false}
                defaultSorted={[{ id: 'positionTitle', desc: false }]}
                columns={makeColumns({ state })}
                data={mockCollaborators}
                parentRef={containerRef}
                stripped
                withOutsideBorder
              />
            )}
          </Col>
        </Row>
      </section>
      {isModalVisible && (
        <ModalPortal>
          <Modal
            title="Add a Collaborator"
            onCancelClick={dismissModal}
            onCloseClick={dismissModal}
            actionButtonText="Add Collaborator"
          >
            <article
              css={css`
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
              `}
            >
              <section>
                <Typography>
                  Please fill out the following information for the collaborator, including a valid
                  Google email address that they will use to log in to ICGC ARGO and ICGC 25K and
                  will be the email address associated with ICGC Controlled Data access.
                </Typography>
              </section>

              <section>
                <FormControl
                  error={!!localState.info_collaboratorType?.error}
                  required={isRequired(localState.info_collaboratorType)}
                >
                  <InputLabel htmlFor="info_collaboratorType">Collaborator Type</InputLabel>
                  <RadioCheckboxGroup
                    id="info_collaboratorType"
                    aria-label="Collaborator Type"
                    isChecked={(item) => collaboratorType === item}
                    onChange={(type) => setCollaboratorType(type)}
                    css={css`
                      display: flex;
                      > * {
                        flex: 1;
                      }

                      > :not(:first-of-type) {
                        margin-left: 15px;
                      }
                    `}
                  >
                    <FormRadio value={CollaboratorType.PERSONNEL}>Authorized Personnel</FormRadio>
                    <FormRadio value={CollaboratorType.STUDENT}>Authorized Student</FormRadio>
                  </RadioCheckboxGroup>

                  <FormHelperText onErrorOnly>
                    {localState.info_collaboratorType?.error?.[0]}
                  </FormHelperText>
                </FormControl>
                <DoubleFieldRow>
                  <FormControl
                    error={!!localState.info_title?.error}
                    required={isRequired(localState.info_title)}
                  >
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
                  <FormControl
                    error={!!localState.info_firstName?.error}
                    required={isRequired(localState.info_firstName)}
                  >
                    <InputLabel htmlFor="info_firstName">First Name</InputLabel>

                    <Input
                      aria-label="First Name"
                      disabled={isSectionDisabled}
                      id="info_firstName"
                      onBlur={validateFieldTouched}
                      onChange={validateFieldTouched}
                      value={localState.info_firstName?.value}
                    />

                    <FormHelperText onErrorOnly>
                      {localState.info_firstName?.error?.[0]}
                    </FormHelperText>
                  </FormControl>

                  <FormControl
                    error={!!localState.info_middleName?.error}
                    required={isRequired(localState.info_middleName)}
                  >
                    <InputLabel htmlFor="info_middleName">Middle Name</InputLabel>

                    <Input
                      aria-label="Middle Name"
                      disabled={isSectionDisabled}
                      id="info_middleName"
                      onBlur={validateFieldTouched}
                      onChange={validateFieldTouched}
                      value={localState.info_middleName?.value}
                    />

                    <FormHelperText onErrorOnly>
                      {localState.info_middleName?.error?.[0]}
                    </FormHelperText>
                  </FormControl>
                </DoubleFieldRow>

                <DoubleFieldRow>
                  <FormControl
                    error={!!localState.info_lastName?.error}
                    required={isRequired(localState.info_lastName)}
                  >
                    <InputLabel htmlFor="info_lastName">Last Name</InputLabel>

                    <Input
                      aria-label="Last Name"
                      disabled={isSectionDisabled}
                      id="info_lastName"
                      onBlur={validateFieldTouched}
                      onChange={validateFieldTouched}
                      value={localState.info_lastName?.value}
                    />

                    <FormHelperText onErrorOnly>
                      {localState.info_lastName?.error?.[0]}
                    </FormHelperText>
                  </FormControl>

                  <FormControl
                    error={!!localState.info_suffix?.error}
                    required={isRequired(localState.info_suffix)}
                  >
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

                    <FormHelperText onErrorOnly>
                      {localState.info_suffix?.error?.[0]}
                    </FormHelperText>
                  </FormControl>
                </DoubleFieldRow>

                <DoubleFieldRow helpText="This must match the applicant’s primary affiliation exactly.">
                  <FormControl
                    error={!!localState.info_primaryAffiliation?.error}
                    required={isRequired(localState.info_primaryAffiliation)}
                  >
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

                <DoubleFieldRow helpText="Must be the institutional email address of the Collaborator.">
                  <FormControl
                    error={!!localState.info_institutionEmail?.error}
                    required={isRequired(localState.info_institutionEmail)}
                  >
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

                <DoubleFieldRow helpText="Must be the Gmail or G Suite email address of the Collaborator.">
                  <FormControl
                    error={!!localState.info_googleEmail?.error}
                    required={isRequired(localState.info_googleEmail)}
                  >
                    <InputLabel htmlFor="info_googleEmail">Google Email</InputLabel>

                    <Input
                      aria-label="Google Email"
                      disabled={isSectionDisabled}
                      id="info_googleEmail"
                      onBlur={validateFieldTouched}
                      onChange={validateFieldTouched}
                      value={localState.info_googleEmail?.value}
                    />

                    <FormHelperText onErrorOnly>
                      {localState.info_googleEmail?.error?.[0]}
                    </FormHelperText>
                  </FormControl>
                </DoubleFieldRow>
                <DoubleFieldRow>
                  <FormControl
                    error={!!localState.info_positionTitle?.error}
                    required={isRequired(localState.info_positionTitle)}
                  >
                    <InputLabel htmlFor="info_positionTitle">
                      {collaboratorType === CollaboratorType.STUDENT
                        ? 'Pursuing Degree'
                        : 'Position Title'}
                    </InputLabel>

                    <Input
                      aria-label="Position Title"
                      disabled={isSectionDisabled}
                      id="info_positionTitle"
                      onBlur={validateFieldTouched}
                      onChange={validateFieldTouched}
                      value={localState.info_positionTitle?.value}
                      placeholder="e.g. Bioinformatician"
                    />

                    <FormHelperText onErrorOnly>
                      {localState.info_positionTitle?.error?.[0]}
                    </FormHelperText>
                  </FormControl>
                  <div />
                </DoubleFieldRow>
              </section>
            </article>
          </Modal>
        </ModalPortal>
      )}
    </article>
  );
};

export default Collaborators;
