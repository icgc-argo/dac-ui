import { createRef, ReactElement, useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { css } from '@emotion/core';
import { AxiosError } from 'axios';
import pluralize from 'pluralize';

import Button from '@icgc-argo/uikit/Button';
import ContentPlaceholder from '@icgc-argo/uikit/ContentPlaceholder';
import FormControl from '@icgc-argo/uikit/form/FormControl';
import FormHelperText from '@icgc-argo/uikit/form/FormHelperText';
import InputLabel from '@icgc-argo/uikit/form/InputLabel';
import FormRadio from '@icgc-argo/uikit/form/FormRadio';
import RadioCheckboxGroup from '@icgc-argo/uikit/form/RadioCheckboxGroup';
import Select from '@icgc-argo/uikit/form/Select';
import Icon from '@icgc-argo/uikit/Icon';
import Input from '@icgc-argo/uikit/form/Input';
import Modal from '@icgc-argo/uikit/Modal';
import Typography from '@icgc-argo/uikit/Typography';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

import {
  ApplicationState,
  Collaborator,
  CollaboratorType,
} from 'components/pages/Applications/types';
import StaticCollaborators from 'components/pages/Applications/PDF/StaticCollaborators';
import { ModalPortal } from 'components/Root';
import { API } from 'global/constants';
import { useAuthContext } from 'global/hooks';

import { honorificsList } from '../constants';
import DoubleFieldRow from '../DoubleFieldRow';
import { isRequired, transformToSelectOptions } from '../validations/helpers';
import {
  FormSectionValidationState_Applicant,
  FormFieldValidationTriggerFunction,
  FormFieldType,
  FormValidationAction,
} from '../types';
import TableComponent from './TableComponent';
import { isDacoAdmin } from 'global/utils/egoTokenUtils';
import ErrorBanner, { AddCollaboratorError, CollaboratorErrorCodes } from './ErrorBanner';

const Collaborators = ({
  appId,
  isSectionDisabled,
  localState,
  refetchAllData,
  applicationState,
  validateFieldTouched,
}: {
  appId: string;
  isSectionDisabled: boolean;
  localState: FormSectionValidationState_Applicant;
  refetchAllData: (action?: Partial<FormValidationAction>) => void;
  applicationState: ApplicationState;
  validateFieldTouched: FormFieldValidationTriggerFunction;
}): ReactElement => {
  const [collaboratorCount, setCollaboratorCount] = useState(0);
  const [modalVisible, setModalVisible] = useState<'collaborator' | string | null>(null);
  const [modalHasErrors, setModalHasErrors] = useState(true);
  const [modalBannerError, setModalBannerError] = useState<
    keyof typeof AddCollaboratorError | null
  >(null);
  const containerRef = createRef<HTMLDivElement>();
  const { fetchWithAuth, permissions } = useAuthContext();
  const theme = useTheme();

  const isAdmin = permissions.length > 0 && isDacoAdmin(permissions);
  const disableActions =
    (isAdmin && applicationState === ApplicationState.APPROVED) ||
    applicationState === ApplicationState.REVIEW;

  const clearCollaboratorModalData = () => {
    validateFieldTouched({
      // faking event values to keep scope limited
      target: {
        id: 'list----clearModal',
        tagName: 'MODAL',
        type: 'clearModal',
      },
      type: 'mousedown',
    });
  };

  const dismissCollaboratorModal = () => {
    clearCollaboratorModalData();
    setModalVisible(null);
    setModalBannerError(null);
  };

  const newCollaboratorModal = () => {
    clearCollaboratorModalData(); // ensure modal is clear for a new collaborator
    setModalVisible('collaborator');
  };

  const handleCollaboratorCreateOrEdit = useCallback(() => {
    const newCollaboratorData = Object.entries(localState.list?.innerType?.fields).reduce(
      (dataAcc, field) => {
        const [fieldName, fieldData] = field as [string, FormFieldType];
        const [prefix, suffix] = fieldName.split('_');

        return {
          ...dataAcc,
          [prefix]: suffix
            ? {
                ...dataAcc[prefix],
                [suffix]: fieldData.value,
              }
            : fieldData.value,
        };
      },
      {} as Record<string, any>,
    );

    fetchWithAuth({
      data: {
        ...newCollaboratorData,
        type: newCollaboratorData.type || CollaboratorType.PERSONNEL,
      },
      method: newCollaboratorData.id ? 'PUT' : 'POST',
      url: `${API.APPLICATIONS}/${appId}/collaborators/${newCollaboratorData.id || ''}`,
    })
      .then((res: any) => {
        if (res.status === 200) {
          refetchAllData();
          dismissCollaboratorModal();
          setModalBannerError(null);
        } else {
          // TODO: troubleshooting log, remove upon release
          console.error('response', res);
        }
      })
      .catch((err: any) => {
        const errorCode = err?.error?.response?.data?.code;

        if (errorCode) {
          setModalBannerError(
            errorCode === CollaboratorErrorCodes.COLLABORATOR_EXISTS
              ? AddCollaboratorError.CollaboratorExists
              : errorCode === CollaboratorErrorCodes.COLLABORATOR_SAME_AS_APPLICANT
              ? AddCollaboratorError.CollaboratorIsApplicant
              : AddCollaboratorError.GenericError,
          );
          console.error('Failed to create collaborator.', errorCode);
        } else {
          setModalBannerError(AddCollaboratorError.GenericError);
          console.error('Failed to create collaborator.', err);
        }
      });
  }, [localState.list?.innerType?.fields]);

  const handleCollaboratorRemove = useCallback(
    (collaboratorID: string) => () => {
      fetchWithAuth({
        method: 'DELETE',
        url: `${API.APPLICATIONS}/${appId}/collaborators/${collaboratorID}`,
      })
        .then(() => {
          refetchAllData();
          dismissCollaboratorModal();
        })
        .catch((err: AxiosError) => {
          console.error('Failed to remove collaborator.', err);
        });
    },
    [localState],
  );

  const handleCollaboratorTypeChange = (value: CollaboratorType) => {
    validateFieldTouched({
      // faking event values to keep scope limited
      target: {
        id: 'list--type',
        tagName: 'INPUT',
        type: 'radio',
        value,
      },
      type: 'change',
    });
  };

  const handleTableActions = (action: 'edit' | 'remove', collaboratorId: string) => () => {
    validateFieldTouched({
      // faking event values to keep scope limited
      target: {
        id: 'list----feedModal',
        tagName: 'MODAL',
        type: 'feedModal',
        value: localState.list.value.find(({ id }: Collaborator) => collaboratorId === id),
      },
      type: 'mousedown',
    });

    switch (action) {
      case 'edit': {
        setModalVisible('collaborator');
        break;
      }

      case 'remove': {
        setModalVisible(collaboratorId);
        break;
      }
    }
  };

  useEffect(() => {
    const newCollaboratorCount = localState.list?.value?.length;

    collaboratorCount === newCollaboratorCount || setCollaboratorCount(newCollaboratorCount);
    setModalHasErrors(
      Object.values(localState.list?.innerType?.fields).some(
        (field: any) => field?.error?.length > 0,
      ) ||
        !Object.entries(localState.list?.innerType?.fields)
          .filter(
            ([fieldName, fieldData]) =>
              fieldName !== 'type' && isRequired(fieldData as FormFieldType),
          )
          .every(([fieldName, fieldData]) => (fieldData as FormFieldType).value),
    );
  }, [localState]);

  return (
    <article>
      <StaticCollaborators />

      <section
        css={css`
          margin-top: 43px;
          border-top: 1px solid ${theme.colors.grey_2};
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
            {pluralize('Collaborators', collaboratorCount, true)}
          </Typography>
          <Button
            size="sm"
            css={css`
              display: flex;
              align-items: center;
            `}
            onClick={newCollaboratorModal}
            disabled={disableActions || isSectionDisabled}
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
            Add a collaborator
          </Button>
        </div>
        <Row
          css={css`
            margin-bottom: 8px;
          `}
        >
          <Col>
            {collaboratorCount > 0 ? (
              <TableComponent
                containerRef={containerRef}
                data={localState.list?.value}
                handleActions={handleTableActions}
                applicationState={applicationState}
                disableActions={disableActions}
              />
            ) : (
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
            )}
          </Col>
        </Row>
      </section>

      {modalVisible &&
        (modalVisible === 'collaborator' ? (
          <ModalPortal>
            <Modal
              actionButtonText={`${
                localState.list?.innerType?.fields.id.value ? 'Edit' : 'Add'
              } Collaborator`}
              actionDisabled={isSectionDisabled || modalHasErrors}
              onActionClick={handleCollaboratorCreateOrEdit}
              onCancelClick={dismissCollaboratorModal}
              onCloseClick={dismissCollaboratorModal}
              title="Add a Collaborator"
            >
              {modalBannerError && <ErrorBanner error={modalBannerError} />}
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
                    Please fill out the following information for the collaborator, including a
                    valid Google or GSuite email address that they will use to log in to ICGC ARGO
                    and ICGC 25K and will be the email address associated with ICGC Controlled Data
                    access.
                  </Typography>
                </section>

                <section>
                  <FormControl
                    error={!!localState.list?.innerType?.fields.type?.error}
                    required={isRequired(localState.list?.innerType?.fields.type)}
                  >
                    <InputLabel htmlFor="info_collaboratorType">Collaborator Type</InputLabel>
                    <RadioCheckboxGroup
                      id="list--type"
                      aria-label="Collaborator Type"
                      isChecked={(item) =>
                        (localState.list?.innerType?.fields.type.value ||
                          CollaboratorType.PERSONNEL) === item
                      }
                      onChange={handleCollaboratorTypeChange}
                      css={css`
                        display: flex;
                        > * {
                          flex: 1;
                        }

                        > :not(:first-of-type) {
                          margin-left: 15px;
                        }
                      `}
                      disabled={isSectionDisabled}
                    >
                      <FormRadio value={CollaboratorType.PERSONNEL}>Authorized Personnel</FormRadio>
                      <FormRadio value={CollaboratorType.STUDENT}>Authorized Student</FormRadio>
                    </RadioCheckboxGroup>

                    <FormHelperText onErrorOnly>
                      {localState.list?.innerType?.fields.type?.error?.[0]}
                    </FormHelperText>
                  </FormControl>

                  <DoubleFieldRow>
                    <FormControl
                      error={!!localState.list?.innerType?.fields.info_title?.error}
                      required={isRequired(localState.list?.innerType?.fields.info_title)}
                    >
                      <InputLabel htmlFor="info_title">Title</InputLabel>

                      <Select
                        aria-label="Title"
                        disabled={isSectionDisabled}
                        id="list--info_title"
                        onBlur={validateFieldTouched}
                        onFocus={validateFieldTouched}
                        eventOnChange={validateFieldTouched}
                        options={transformToSelectOptions(honorificsList)}
                        value={localState.list?.innerType?.fields.info_title?.value}
                      />

                      <FormHelperText onErrorOnly>
                        {localState.list?.innerType?.fields.info_title?.error?.[0]}
                      </FormHelperText>
                    </FormControl>
                    &nbsp;
                  </DoubleFieldRow>

                  <DoubleFieldRow>
                    <FormControl
                      error={!!localState.list?.innerType?.fields.info_firstName?.error}
                      required={isRequired(localState.list?.innerType?.fields.info_firstName)}
                    >
                      <InputLabel htmlFor="info_firstName">First Name</InputLabel>

                      <Input
                        aria-label="First Name"
                        disabled={isSectionDisabled}
                        id="list--info_firstName"
                        onBlur={validateFieldTouched}
                        onChange={validateFieldTouched}
                        value={localState.list?.innerType?.fields.info_firstName?.value}
                      />

                      <FormHelperText onErrorOnly>
                        {localState.list?.innerType?.fields.info_firstName?.error?.[0]}
                      </FormHelperText>
                    </FormControl>

                    <FormControl
                      error={!!localState.list?.innerType?.fields.info_middleName?.error}
                      required={isRequired(localState.list?.innerType?.fields.info_middleName)}
                    >
                      <InputLabel htmlFor="info_middleName">Middle Name</InputLabel>

                      <Input
                        aria-label="Middle Name"
                        disabled={isSectionDisabled}
                        id="list--info_middleName"
                        onBlur={validateFieldTouched}
                        onChange={validateFieldTouched}
                        value={localState.list?.innerType?.fields.info_middleName?.value}
                      />

                      <FormHelperText onErrorOnly>
                        {localState.list?.innerType?.fields.info_middleName?.error?.[0]}
                      </FormHelperText>
                    </FormControl>
                  </DoubleFieldRow>

                  <DoubleFieldRow>
                    <FormControl
                      error={!!localState.list?.innerType?.fields.info_lastName?.error}
                      required={isRequired(localState.list?.innerType?.fields.info_lastName)}
                    >
                      <InputLabel htmlFor="info_lastName">Last Name</InputLabel>

                      <Input
                        aria-label="Last Name"
                        disabled={isSectionDisabled}
                        id="list--info_lastName"
                        onBlur={validateFieldTouched}
                        onChange={validateFieldTouched}
                        value={localState.list?.innerType?.fields.info_lastName?.value}
                      />

                      <FormHelperText onErrorOnly>
                        {localState.list?.innerType?.fields.info_lastName?.error?.[0]}
                      </FormHelperText>
                    </FormControl>

                    <FormControl
                      error={!!localState.list?.innerType?.fields.info_suffix?.error}
                      required={isRequired(localState.list?.innerType?.fields.info_suffix)}
                    >
                      <InputLabel htmlFor="info_suffix">Suffix</InputLabel>

                      <Input
                        aria-label="Suffix, e.g. Jr., Sr., MD."
                        disabled={isSectionDisabled}
                        id="list--info_suffix"
                        onBlur={validateFieldTouched}
                        onChange={validateFieldTouched}
                        placeholder="e.g. Jr., Sr., MD."
                        value={localState.list?.innerType?.fields.info_suffix?.value}
                      />

                      <FormHelperText onErrorOnly>
                        {localState.list?.innerType?.fields.info_suffix?.error?.[0]}
                      </FormHelperText>
                    </FormControl>
                  </DoubleFieldRow>

                  <DoubleFieldRow helpText="This must match the applicant’s primary affiliation exactly.">
                    <FormControl
                      error={
                        // additional logic to quietly ensure validation is applied before allowing save
                        !!localState.list?.innerType?.fields.info_primaryAffiliation?.error?.filter(
                          (e: string) => e,
                        ).length
                      }
                      required={isRequired(
                        localState.list?.innerType?.fields.info_primaryAffiliation,
                      )}
                    >
                      <InputLabel htmlFor="info_primaryAffiliation">Primary Affiliation</InputLabel>

                      <Input
                        aria-label="Primary Affiliation"
                        disabled={isSectionDisabled}
                        id="list--info_primaryAffiliation"
                        onBlur={validateFieldTouched}
                        onChange={validateFieldTouched}
                        value={localState.list?.innerType?.fields.info_primaryAffiliation?.value}
                      />

                      <FormHelperText onErrorOnly>
                        {localState.list?.innerType?.fields.info_primaryAffiliation?.error?.[0]}
                      </FormHelperText>
                    </FormControl>
                  </DoubleFieldRow>

                  <DoubleFieldRow helpText="Must be the institutional email address of the Collaborator.">
                    <FormControl
                      error={!!localState.list?.innerType?.fields.info_institutionEmail?.error}
                      required={isRequired(
                        localState.list?.innerType?.fields.info_institutionEmail,
                      )}
                    >
                      <InputLabel htmlFor="info_institutionEmail">Institutional Email</InputLabel>

                      <Input
                        aria-label="Institutional Email"
                        disabled={isSectionDisabled}
                        id="list--info_institutionEmail"
                        onBlur={validateFieldTouched}
                        onChange={validateFieldTouched}
                        value={localState.list?.innerType?.fields.info_institutionEmail?.value}
                      />

                      <FormHelperText onErrorOnly>
                        {localState.list?.innerType?.fields.info_institutionEmail?.error?.[0]}
                      </FormHelperText>
                    </FormControl>
                  </DoubleFieldRow>

                  <DoubleFieldRow helpText="Must be the Gmail or G Suite email address of the Collaborator.">
                    <FormControl
                      error={!!localState.list?.innerType?.fields.info_googleEmail?.error}
                      required={isRequired(localState.list?.innerType?.fields.info_googleEmail)}
                    >
                      <InputLabel htmlFor="info_googleEmail">Google Email</InputLabel>

                      <Input
                        aria-label="Google Email"
                        disabled={isSectionDisabled}
                        id="list--info_googleEmail"
                        onBlur={validateFieldTouched}
                        onChange={validateFieldTouched}
                        value={localState.list?.innerType?.fields.info_googleEmail?.value}
                      />

                      <FormHelperText onErrorOnly>
                        {localState.list?.innerType?.fields.info_googleEmail?.error?.[0]}
                      </FormHelperText>
                    </FormControl>
                  </DoubleFieldRow>

                  <DoubleFieldRow>
                    <FormControl
                      error={!!localState.list?.innerType?.fields.info_positionTitle?.error}
                      required={isRequired(localState.list?.innerType?.fields.info_positionTitle)}
                    >
                      <InputLabel htmlFor="info_positionTitle">
                        {localState.list?.innerType?.fields.type.value === CollaboratorType.STUDENT
                          ? 'Pursuing Degree'
                          : 'Position Title'}
                      </InputLabel>

                      <Input
                        aria-label="Position Title"
                        disabled={isSectionDisabled}
                        id="list--info_positionTitle"
                        onBlur={validateFieldTouched}
                        onChange={validateFieldTouched}
                        value={localState.list?.innerType?.fields.info_positionTitle?.value}
                        placeholder={
                          localState.list?.innerType?.fields.type.value === CollaboratorType.STUDENT
                            ? 'e.g. Doctoral'
                            : 'e.g. Bioinformatician'
                        }
                      />

                      <FormHelperText onErrorOnly>
                        {localState.list?.innerType?.fields.info_positionTitle?.error?.[0]}
                      </FormHelperText>
                    </FormControl>
                    <div />
                  </DoubleFieldRow>
                </section>
              </article>
            </Modal>
          </ModalPortal>
        ) : (
          <ModalPortal>
            <Modal
              actionButtonText="Remove Collaborator"
              onActionClick={handleCollaboratorRemove(modalVisible)}
              onCancelClick={dismissCollaboratorModal}
              onCloseClick={dismissCollaboratorModal}
              title="Remove Collaborator?"
            >
              {`Are you sure you want to remove ${localState.list?.innerType?.fields.info_firstName?.value} ${localState.list?.innerType?.fields.info_lastName?.value} from this application?`}
            </Modal>
          </ModalPortal>
        ))}
    </article>
  );
};

export default Collaborators;
