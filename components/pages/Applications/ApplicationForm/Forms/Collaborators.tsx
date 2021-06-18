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
import { instructionBoxButtonContentStyle, instructionBoxButtonIconStyle } from 'global/styles';
import React from 'react';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import Table from '@icgc-argo/uikit/Table';
import { Col, Row } from 'react-grid-system';
import pluralize from 'pluralize';
import { isEmpty } from 'lodash';
import ContentPlaceholder from '@icgc-argo/uikit/ContentPlaceholder';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';

const columns = [
  {
    Header: 'Collaborator Type',
  },
];

const Collaborators = ({}) => {
  const containerRef = React.createRef<HTMLDivElement>();

  const collaborators = [];
  const theme = useTheme();

  return (
    <article>
      <Typography bold component="h2">
        C. Collaborators
      </Typography>

      <section>
        <Typography
          css={css`
            margin-bottom: 43px;
          `}
        >
          Please include the names of all{' '}
          <b>
            investigators, collaborators, research staff (including post-docs) and students
            (including graduate students),
          </b>{' '}
          who will have access to the ICGC Controlled Data in order to work on the project (see
          "Research Project" under Section D).
          <br />
          <br />* Please note: Co-investigators, collaborators or students at other institutions
          should not be included in this list. They will have to submit a separate Application for
          Controlled Data Access.
        </Typography>
      </section>
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
            {collaborators.length.toLocaleString()}{' '}
            {pluralize('Collaborators', collaborators.length)}
          </Typography>
          <Button
            size="sm"
            variant="primary"
            css={css`
              display: flex;
              align-items: center;
            `}
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
            {isEmpty(collaborators) ? (
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
              <Table columns={[]} parentRef={containerRef} stripped />
            )}
          </Col>
        </Row>
      </section>
    </article>
  );
};

export default Collaborators;
