import React, { ReactElement, useState } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { SortedChangeFunction } from 'react-table';
import pluralize from 'pluralize';

import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import CardContainer from '@icgc-argo/uikit/Container';
import Typography from '@icgc-argo/uikit/Typography';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Table from '@icgc-argo/uikit/Table';

import {
  ApplicationsSort,
  ApplicationsSortingRule,
  ApplicationsSortOrder,
  ApplicationsField,
} from '../types';

import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE,
  DEFAULT_SORT,
  formatTableData,
  stringifySort,
  tableColumns,
} from './utils';

import PageHeader from 'components/PageHeader';
import { ContentError, ContentLoader } from 'components/placeholders';
import { instructionBoxButtonIconStyle, instructionBoxButtonContentStyle } from 'global/styles';
import { useApplicationsAPI } from 'global/hooks';

const useManageApplicationsState = () => {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [sort, setSort] = useState<string>(stringifySort(DEFAULT_SORT));

  const onPageChange = (newPageNum: number) => {
    setPage(newPageNum);
  };

  const onPageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const onSortedChange: SortedChangeFunction = async (newSorted: ApplicationsSortingRule[]) => {
    const newSort = newSorted.reduce(
      (accSort: Array<ApplicationsSort>, sortRule: ApplicationsSortingRule) => {
        const order = sortRule.desc ? 'desc' : 'asc';
        return accSort.concat({
          field: sortRule.id as ApplicationsField,
          order: order as ApplicationsSortOrder,
        }) as ApplicationsSort[];
      },
      [],
    );
    setSort(stringifySort(newSort))
  };

  return {
    onPageChange,
    onPageSizeChange,
    onSortedChange,
    page,
    pageSize,
    sort,
  };
}

const ManageApplications = (): ReactElement => {
  const {
    onPageChange,
    onPageSizeChange,
    onSortedChange,
    page,
    pageSize,
    sort,
  } = useManageApplicationsState();

  const theme = useTheme();
  const containerRef = React.createRef<HTMLDivElement>();

  const { error, isLoading, response } = useApplicationsAPI({
    page,
    pageSize,
    sort
  });

  const submissionsCount = response?.data?.pagingInfo?.totalCount || 0;
  const tableData = response?.data.items || [];
  const tableDataFormatted = formatTableData(tableData);

  return (
    <>
      <PageHeader>ICGC DACO Dashboard</PageHeader>
      <Container
        css={css`
          margin: 24px auto;
          width: 100%;
        `}
      >
        <CardContainer
          loading={isLoading}
        >
          {error
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
                      {/* TODO status indicators */}
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
                      {/* TODO search */}
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
                          // TODO export to file
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

export default ManageApplications;
