import { ReactElement } from 'react';
import { Col, Container, Row } from 'react-grid-system';

import { css } from '@icgc-argo/uikit';
import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import CardContainer from '@icgc-argo/uikit/Container';
import Typography from '@icgc-argo/uikit/Typography';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import { TableActionBar } from '@icgc-argo/uikit/Table';

import PageHeader from 'components/PageHeader';
import { instructionBoxButtonIconStyle, instructionBoxButtonContentStyle } from 'global/styles';

const ApplicationsDashboard = (): ReactElement => {
  const theme = useTheme();
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
          {/* header row */}
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
              <Col>Table</Col>
            </Row>
            <Row
              css={css`
                justify-content: space-between;
              `}
            >
              <Col>left</Col>
              <Col
                css={css`
                  display: flex;
                  justify-content: flex-end;
                `}
              >right</Col>
            </Row>
          </Container>
        </CardContainer>
      </Container>
    </>
  );
};

export default ApplicationsDashboard;
