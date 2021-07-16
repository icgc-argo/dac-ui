import { css } from '@emotion/core';
import Typography from '@icgc-argo/uikit/Typography';
import PageHeader from 'components/PageHeader';
import { Container, Row } from 'react-grid-system';
import Applications from './Applications';
import AccessBox from './AccessBox';
import { useGetApplications } from 'global/hooks';
import { ContentError } from 'components/placeholders';
import Loader from 'components/Loader';

const Dashboard = () => {
  const { error, isLoading, response } = useGetApplications();

  const applications = response?.data?.items || [];

  return (
    <>
      <PageHeader>My Applications</PageHeader>
      <Container
        css={css`
          margin-top: 24px;
        `}
      >
        {isLoading
          ? (
            <div css={css`width: 100%;`}>
              <Loader css={css`
                margin: 24px auto;
              `}
              />
            </div>)
          : error
            ? <ContentError />
            : (
              <>
                <Row
                  css={css`
                    justify-content: space-between;
                    margin-bottom: 57px;
                  `}
                  nogutter
                >
                  <div
                    css={css`
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    `}
                  >
                    <Typography
                      variant="paragraph2"
                      css={css`
                        margin-right: 80px;
                      `}
                    >
                      This is where you can manage your Applications for Access to ICGC Controlled Data.
                      Access will be granted for a <b>one year period</b>, starting from the date of
                      approval by the ICGC DACO.
                    </Typography>
                    <AccessBox />
                  </div>
                </Row>
                <Row nogutter>
                  <Applications inProgressApplications={applications} />
                </Row>
              </>
            )}
      </Container>
    </>
  );
};

export default Dashboard;
