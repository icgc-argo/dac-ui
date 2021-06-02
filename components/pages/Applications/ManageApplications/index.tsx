import React, { ReactElement } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { startCase } from 'lodash';
import { format as formatDate, parseISO } from 'date-fns';

import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import CardContainer from '@icgc-argo/uikit/Container';
import Typography from '@icgc-argo/uikit/Typography';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Table from '@icgc-argo/uikit/Table';

import draftData from './draftData.json';
import { ApplicationTable } from './types';

import PageHeader from 'components/PageHeader';
import { instructionBoxButtonIconStyle, instructionBoxButtonContentStyle } from 'global/styles';
import { DATE_RANGE_DISPLAY_FORMAT } from 'global/constants';

const formatTableData = (data: any) => data.map((datum: any) => ({
  appId: datum.appId,
  institution: datum.applicant.info.primaryAffiliation,
  applicant: datum.applicant.info.displayName,
  googleEmail: datum.applicant.info.googleEmail,
  ethicsLetter: datum.ethics.declaredAsRequired,
  accessExpiry: datum.expiresAtUtc,
  lastUpdated: datum.updatedAtUtc,
  status: datum.state,
}));

const tableColumns: ApplicationTable[] = [
  {
    Header: 'Application #',
    accessor: 'appId',
    // TODO: link to application page
    Cell: ({ original }) => original.appId,
  },
  {
    Header: 'Institution',
    accessor: 'institution',
    Cell: ({ original }) => original.institution,
  },
  {
    Header: 'Applicant',
    accessor: 'applicant',
    Cell: ({ original }) => original.applicant,
  },
  {
    Header: 'Applicant Google Email',
    accessor: 'googleEmail',
    Cell: ({ original }) => original.googleEmail,
  },
  {
    Header: 'Ethics Letter',
    accessor: 'ethicsLetter',
    sortable: false,
    Cell: ({ original }) => original.ethicsLetter ? 'Yes' : 'No',
  },
  {
    Header: 'Access Expiry',
    accessor: 'accessExpiry',
    Cell: ({ original }) => formatDate(new Date(original.accessExpiry), DATE_RANGE_DISPLAY_FORMAT),
  },
  {
    Header: 'Last Updated',
    accessor: 'lastUpdated',
    Cell: ({ original }) => formatDate(new Date(original.lastUpdated), DATE_RANGE_DISPLAY_FORMAT),
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ original }) => startCase(original.status.toLowerCase()),
  },
];

const ApplicationsDashboard = (): ReactElement => {
  const theme = useTheme();
  const containerRef = React.createRef<HTMLDivElement>();
  return (
    <>
      <PageHeader>ICGC DACO Dashboard</PageHeader>
      <Container
        css={css`
          margin-top: 24px;
          width: 100%;
        `}
      >
        <CardContainer
        // TODO with data hookup
        // loading={loading}
        >
          <Container
            css={css`
              margin-top: 24px;
              margin-bottom: 16px;
              width: 100%;
              border-bottom: 1px solid ${theme.colors.grey_2};
              padding: 0 24px !important;
            `}
          >
            <Row
              css={css`
                justify-content: space-between;
              `}
            >
              <Col>
                <Typography
                  as="h2"
                  variant="subtitle2"
                  css={css`
                    line-height: 1.3;
                  `}
                >
                  Manage Applications
                </Typography>
              </Col>
              <Col>
                {/* placeholder for status indicators */}
              </Col>
            </Row>
          </Container>
          <Container
            css={css`
              width: 100%;
              padding: 0 24px !important;
            `}
          >
            <Row
              css={css`
                align-items: center !important;
                justify-content: space-between;
                margin-bottom: 10px;
              `}
            >
              <Col>
                <Typography
                  as="p"
                  color={theme.colors.grey}
                  css={css`
                    margin: 0 0 0 6px;
                  `}
                  variant="data"
                >
                  55 submissions
                </Typography>
              </Col>
              <Col
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                `}>
                <Button
                  size="sm"
                  variant="secondary"
                >
                  <span css={instructionBoxButtonContentStyle}>
                    <Icon
                      name="download"
                      fill="accent2_dark"
                      height="12px"
                      css={instructionBoxButtonIconStyle}
                    />
                    Export Table
                  </span>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Table
                  columns={tableColumns}
                  data={formatTableData(draftData.items)}
                  stripped
                  withOutsideBorder
                  parentRef={containerRef}
                />
              </Col>
            </Row>
          </Container>
        </CardContainer>
      </Container>
    </>
  );
};

export default ApplicationsDashboard;
