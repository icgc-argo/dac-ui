import Typography from '@icgc-argo/uikit/Typography';
import { css } from '@emotion/core';
import React, { useState } from 'react';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import Table from '@icgc-argo/uikit/Table';
import { Col, Row } from 'react-grid-system';
import pluralize from 'pluralize';
import { isEmpty } from 'lodash';
import ContentPlaceholder from '@icgc-argo/uikit/ContentPlaceholder';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import StaticCollaborators from '../../PDF/StaticCollaborators';

const Actions = () => {
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
      <Icon name="edit" width="20px" height="20px" fill={theme.colors.accent2} />
      <Icon name="trash" width="19px" height="20px" />
    </div>
  );
};

const columns = [
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
    Cell: () => <Actions />,
  },
];

const mock = [
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

const Collaborators = ({ appId }: { appId: string }) => {
  const [collaborators, setCollaborators] = useState(mock);

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
            {collaborators.length.toLocaleString()}{' '}
            {pluralize('Collaborators', collaborators.length)}
          </Typography>
          <Button
            size="sm"
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
              <Table
                css={css`
                  margin-top: 9px;
                `}
                showPagination={false}
                defaultSorted={[{ id: 'positionTitle', desc: false }]}
                columns={columns}
                data={collaborators}
                parentRef={containerRef}
                stripped
                withOutsideBorder
              />
            )}
          </Col>
        </Row>
      </section>
    </article>
  );
};

export default Collaborators;
