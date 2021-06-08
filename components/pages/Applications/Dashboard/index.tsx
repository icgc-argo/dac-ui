import { css } from '@emotion/core';
import Typography from '@icgc-argo/uikit/Typography';
import PageHeader from 'components/PageHeader';
import { Container, Row } from 'react-grid-system';
import Applications from './Applications';
import AccessBox from './AccessBox';

const Dashboard = () => {
  const [applications, setApplications] = React.useState([]);
 
  return (
    <>
      <PageHeader>My Applications</PageHeader>
      <Container
        css={css`
          margin-top: 24px;
        `}
      >
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
            <AccessBox hasAccess={true} />
          </div>
        </Row>
        <Row nogutter>
          <Applications inProgressApplications={[]} />
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
