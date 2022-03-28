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

import React, { ReactElement, useState } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { SortedChangeFunction } from 'react-table';
import pluralize from 'pluralize';
import { trim } from 'lodash';

import { css } from '@icgc-argo/uikit';
import CardContainer from '@icgc-argo/uikit/Container';
import Typography from '@icgc-argo/uikit/Typography';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Table from '@icgc-argo/uikit/Table';

import {
  ApplicationsSort,
  ApplicationsSortingRule,
  ApplicationsSortOrder,
  ApplicationsField,
  ApplicationState,
} from '../types';

import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE,
  formatTableData,
  adminStatesAllowList,
  tableColumns,
  DEFAULT_SORT,
} from './utils';

import PageHeader from 'components/PageHeader';
import { useDataContext, useGetApplications } from 'global/hooks';
import GenericError from 'components/pages/Error/Generic';
import Icon from '@icgc-argo/uikit/Icon';
import Input from '@icgc-argo/uikit/form/Input';
import useDebounce from 'global/hooks/useDebounce';
import Button from '@icgc-argo/uikit/Button';
import { instructionBoxButtonContentStyle, instructionBoxButtonIconStyle } from 'global/styles';
import { AxiosError, AxiosResponse } from 'axios';
import { createDownloadInWindow } from 'global/utils/helpers';
import { CustomLoadingButton } from '../ApplicationForm/Forms/common';

const getDefaultSort = (applicationSorts: ApplicationsSort[]) =>
  applicationSorts.map(({ field, order }) => ({ id: field, desc: order === 'desc' }));

const useManageApplicationsState = () => {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [sort, setSort] = useState<ApplicationsSort[]>(DEFAULT_SORT);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onSearchQueryChange = (newQuery: string) => {
    setSearchQuery(newQuery);
  };

  const onPageChange = (newPageNum: number) => {
    setPage(newPageNum);
  };

  const onPageSizeChange = (newPageSize: number) => {
    setPage(0);
    setPageSize(newPageSize);
  };

  const onSortedChange: SortedChangeFunction = async (newSorted: ApplicationsSortingRule[]) => {
    const newSort = newSorted.reduce(
      (accSort: Array<ApplicationsSort>, sortRule: ApplicationsSortingRule) => {
        const order = sortRule.desc ? 'desc' : 'asc';

        return accSort.concat({
          field:
            // if sorting on appId, use appNumber instead
            sortRule.id === ApplicationsField.appId
              ? ApplicationsField.appNumber
              : (sortRule.id as ApplicationsField),
          order: order as ApplicationsSortOrder,
        }) as ApplicationsSort[];
      },
      [],
    );
    setSort(newSort);
  };

  return {
    onPageChange,
    onPageSizeChange,
    onSortedChange,
    onSearchQueryChange,
    page,
    pageSize,
    sort,
    searchQuery,
  };
};

const ManageApplications = (): ReactElement => {
  const {
    onPageChange,
    onPageSizeChange,
    onSortedChange,
    onSearchQueryChange,
    page,
    pageSize,
    sort,
    searchQuery,
  } = useManageApplicationsState();

  const { fetchWithAuth } = useDataContext();
  const theme = useTheme();
  const containerRef = React.createRef<HTMLDivElement>();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { error, isLoading, response } = useGetApplications({
    page,
    pageSize,
    sort,
    states: adminStatesAllowList,
    includeStats: true,
    query: trim(debouncedSearchQuery),
  });
  const { items = [] } = response?.data || {};
  const { pagesCount = 0, totalCount = 0 } = response?.data?.pagingInfo || {};
  const { countByState = {} } = response?.data?.stats || {};

  const stats: { accessor: ApplicationState; header: string; icon: React.ReactElement }[] = [
    {
      accessor: ApplicationState.REVIEW,
      header: 'For Review',
      icon: <img src="/icons-status-review.svg" width="18px" height="18px" />,
    },
    {
      accessor: ApplicationState.APPROVED,
      header: 'Approved',
      icon: <Icon name="success" fill={theme.colors.accent1} width="18px" height="18px" />,
    },
    {
      accessor: ApplicationState.REVISIONS_REQUESTED,
      header: 'Revisions Requested',
      icon: <img src="/icons-toc-edit.svg" width="18px" height="18px" />,
    },
    {
      accessor: ApplicationState.EXPIRED,
      header: 'Expired',
      icon: <img src="/icons-toc-errors.svg" width="18px" height="18px" />,
    },
  ];

  const [tsvIsLoading, setTsvIsLoading] = useState(false);

  return (
    <>
      <PageHeader>ICGC DACO Dashboard</PageHeader>
      <Container
        css={css`
          margin: 24px auto;
          width: 100%;
        `}
      >
        <CardContainer loading={isLoading}>
          {error ? (
            <GenericError />
          ) : (
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
                <Row>
                  <Col md={5}>
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
                  <Col md={7}>
                    <Row style={{ justifyContent: 'space-between', paddingRight: '24px' }}>
                      {stats.map((stat) => (
                        <Row style={{ alignItems: 'center', margin: 0 }}>
                          {stat.icon}
                          <Typography
                            css={css`
                              margin-left: 8px;
                              line-height: 20px;
                            `}
                          >
                            {countByState[stat.accessor]} {stat.header}
                          </Typography>
                        </Row>
                      ))}
                    </Row>
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
                      {totalCount.toLocaleString()} {pluralize('submissions', totalCount)}
                    </Typography>
                  </Col>
                  <Col
                    css={css`
                      display: flex;
                      align-items: center;
                      justify-content: flex-end;
                    `}
                  >
                    <Button
                      isAsync
                      size="sm"
                      variant="secondary"
                      css={css`
                        margin-right: 10px;
                      `}
                      isLoading={tsvIsLoading}
                      Loader={(props: any) => (
                        <CustomLoadingButton text="Application History" {...props} />
                      )}
                      onClick={async () => {
                        setTsvIsLoading(true);
                        fetchWithAuth({
                          url: '/export/application-history',
                        })
                          .then((response: AxiosResponse) => {
                            const contentDispositionHeader =
                              response.headers['content-disposition'];
                            if (!contentDispositionHeader) {
                              throw Error('Missing content-disposition header.');
                            }
                            const filename = contentDispositionHeader
                              .split('filename=')[1]
                              .replace(/['"]+/g, '');

                            const blob = new Blob([response.data], {
                              type: response.config.responseType || 'application/octet-stream',
                            });

                            createDownloadInWindow(filename, blob);
                          })
                          .catch((err: AxiosError) => {
                            console.warn('Could not download application history, ', err);
                          })
                          .finally(() => {
                            setTsvIsLoading(false);
                          });
                      }}
                    >
                      <span css={instructionBoxButtonContentStyle}>
                        <Icon
                          name="download"
                          fill="accent2_dark"
                          height="12px"
                          css={instructionBoxButtonIconStyle}
                        />
                        Application History
                      </span>
                    </Button>
                    {/* <Button
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
                      </Button> */}
                    <Input
                      aria-label="application-table-search"
                      placeholder="Search..."
                      preset="search"
                      value={searchQuery}
                      onChange={(e) => {
                        onSearchQueryChange(e.target.value);
                      }}
                      css={css`
                        width: 200px;
                      `}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Table
                      columns={tableColumns}
                      data={formatTableData(items)}
                      NoDataComponent={() => null}
                      defaultSorted={getDefaultSort(DEFAULT_SORT)}
                      manual
                      onPageChange={onPageChange}
                      onPageSizeChange={onPageSizeChange}
                      onSortedChange={onSortedChange}
                      page={page}
                      pages={pagesCount}
                      pageSize={pageSize}
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
