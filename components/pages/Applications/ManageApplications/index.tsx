import React, { ReactElement, useEffect } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { startCase } from 'lodash';
import { format as formatDate } from 'date-fns';
import { SortedChangeFunction } from 'react-table';
import pluralize from 'pluralize';

import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import CardContainer from '@icgc-argo/uikit/Container';
import Typography from '@icgc-argo/uikit/Typography';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Table, { TableColumnConfig } from '@icgc-argo/uikit/Table';

import {
  ManageApplicationsRequestData,
  ManageApplicationsSort,
  ManageApplicationsSortingRule,
  ManageApplicationsSortOrder,
  ManageApplicationsField,
  ApplicationRecord,
} from './types';

import PageHeader from 'components/PageHeader';
import { ContentError } from 'components/placeholders';
import { instructionBoxButtonIconStyle, instructionBoxButtonContentStyle } from 'global/styles';
import { DATE_RANGE_DISPLAY_FORMAT } from 'global/constants';
import { useFetchManageApplications } from 'global/hooks';

const fieldDisplayNames = {
  appId: 'Application #',
  'applicant.info.primaryAffiliation': 'Institution',
  'applicant.info.displayName': 'Applicant',
  'applicant.info.googleEmail': 'Applicant Google Email',
  'expiresAtUtc': 'Access Expiry',
  'updatedAtUtc': 'Last Updated',
  'state': 'Status',
  'ethics.declaredAsRequired': 'Ethics Letter',
}

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

const tableColumns: TableColumnConfig<ApplicationRecord> & { id: ManageApplicationsField } = [
  {
    Header: fieldDisplayNames['appId'],
    id: ManageApplicationsField['appId'],
    accessor: 'appId',
    // TODO: link to application page
    Cell: ({ original }: { original: ApplicationRecord }) => original.appId,
  },
  {
    Header: fieldDisplayNames['applicant.info.primaryAffiliation'],
    id: ManageApplicationsField['applicant.info.primaryAffiliation'],
    accessor: 'institution',
  },
  {
    Header: fieldDisplayNames['applicant.info.displayName'],
    id: ManageApplicationsField['applicant.info.displayName'],
    accessor: 'applicant',
  },
  {
    Header: fieldDisplayNames['applicant.info.googleEmail'],
    id: ManageApplicationsField['applicant.info.googleEmail'],
    accessor: 'googleEmail',
  },
  {
    Header: fieldDisplayNames['ethics.declaredAsRequired'],
    id: ManageApplicationsField['ethics.declaredAsRequired'],
    sortable: false,
    Cell: ({ original }: { original: ApplicationRecord }) => original.ethicsLetter ? 'Yes' : 'No',
  },
  {
    Header: fieldDisplayNames['expiresAtUtc'],
    id: ManageApplicationsField['expiresAtUtc'],
    accessor: 'accessExpiry',
    Cell: ({ original }: { original: ApplicationRecord }) => original.accessExpiry
      ? formatDate(new Date(original.accessExpiry), DATE_RANGE_DISPLAY_FORMAT)
      : null,
  },
  {
    Header: fieldDisplayNames['updatedAtUtc'],
    id: ManageApplicationsField['updatedAtUtc'],
    accessor: 'lastUpdated',
    Cell: ({ original }: { original: ApplicationRecord }) => original.lastUpdated
      ? formatDate(new Date(original.lastUpdated), DATE_RANGE_DISPLAY_FORMAT)
      : null,
  },
  {
    Header: fieldDisplayNames['state'],
    id: ManageApplicationsField['state'],
    accessor: 'status',
    Cell: ({ original }: { original: ApplicationRecord }) => startCase(original.status.toLowerCase()),
  },
];

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_SORT = [{ field: 'state', order: 'desc' }];

const useManageApplicationsState = () => {
  const [pagingState, setPagingState] = React.useState({
    pageSize: DEFAULT_PAGE_SIZE,
    page: DEFAULT_PAGE,
    sort: DEFAULT_SORT,
  });

  React.useEffect(() => {
    resetCurrentPage();
  }, [pagingState.pageSize]);

  const handlePagingStateChange = (state: typeof pagingState) => {
    setPagingState(state);
  };

  const onPageChange = (newPageNum: number) => {
    handlePagingStateChange({ ...pagingState, page: newPageNum });
  };

  const onPageSizeChange = (newPageSize: number) => {
    handlePagingStateChange({
      ...pagingState,
      pageSize: newPageSize,
    });
  };

  const onSortedChange: SortedChangeFunction = async (newSorted: ManageApplicationsSortingRule[]) => {
    const sort = newSorted.reduce(
      (accSort: Array<ManageApplicationsSort>, sortRule: ManageApplicationsSortingRule) => {
        const order = sortRule.desc ? 'desc' : 'asc';
        return accSort.concat({
          field: sortRule.id as ManageApplicationsField,
          order: order as ManageApplicationsSortOrder,
        }) as ManageApplicationsSort[];
      },
      [],
    );
    handlePagingStateChange({ ...pagingState, sort });
  };
  const resetCurrentPage = () => {
    setPagingState({
      ...pagingState,
      page: 0,
    });
  };
  return {
    pagingState,
    onPageChange,
    onPageSizeChange,
    onSortedChange,
    resetCurrentPage,
  };
};

const ApplicationsDashboard = (): ReactElement => {
  const theme = useTheme();
  const containerRef = React.createRef<HTMLDivElement>();

  const {
    pagingState,
    onPageChange,
    onPageSizeChange,
    onSortedChange,
    resetCurrentPage,
  } = useManageApplicationsState();
  // useEffect(() => {
  //   resetCurrentPage();
  // }, []);

  // if i put this in useEffect it STOPS WORKING
  const { error, isLoading = true, response } = useFetchManageApplications(pagingState as ManageApplicationsRequestData);

  const submissionsCount = response?.data?.pagingInfo?.totalCount;
  const tableData = response?.data.items || [];
  const tableDataFormatted = formatTableData(tableData);

  console.log(error, isLoading, response)

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
          loading={isLoading}
        >
          {isLoading
            ? <p>&nsbp;</p> // placeholder to make loader appear
            : error
              ? <ContentError />
              : (
                <>
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
                          {submissionsCount.toLocaleString()} {pluralize('submissions', submissionsCount)}
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
                          data={tableDataFormatted}
                          onPageChange={onPageChange}
                          onPageSizeChange={onPageSizeChange}
                          onSortedChange={onSortedChange}
                          parentRef={containerRef}
                          stripped
                          withOutsideBorder
                        />
                      </Col>
                    </Row>
                  </Container>
                </>
              )}
        </CardContainer>
      </Container>
    </>
  );
};

export default ApplicationsDashboard;
