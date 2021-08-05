import { useRouter } from 'next/router';
import { css } from '@emotion/core';
import urlJoin from 'url-join';

import Button from '@icgc-argo/uikit/Button';
import Icon from '@icgc-argo/uikit/Icon';
import Link from '@icgc-argo/uikit/Link';
import { useTheme } from '@icgc-argo/uikit/ThemeProvider';
import Typography from '@icgc-argo/uikit/Typography';

import { API, APPLICATIONS_PATH, DACO_APPLYING_DOCS } from 'global/constants';
import { useAuthContext } from 'global/hooks';

import DashboardCard from '../Card';

const StartApplication = () => {
  const theme = useTheme();
  const { fetchWithAuth } = useAuthContext();
  const router = useRouter();

  const createNewApplication = () => {
    fetchWithAuth({
      url: API.APPLICATIONS,
      method: 'POST',
    })
      .then(({ data }: { data: any }) => {
        router.push(urlJoin(APPLICATIONS_PATH, data.appId));
      })
      .catch((e: any) => console.error('Failed to create new application.', e));
  };

  return (
    <DashboardCard title="Start a New Application">
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px 0;
        `}
      >
        <Typography
          variant="data"
          css={css`
            margin-bottom: 28px;
            max-width: 520px;
            text-align: center;
          `}
        >
          Start a new application, fill out all required sections, then sign and submit the
          application. The ICGC DACO will review and grant access to{' '}
          <Link href={DACO_APPLYING_DOCS} rel="noopener noreferrer" target="_blank">
            eligible project teams.
          </Link>
        </Typography>

        <Button onClick={createNewApplication} size="sm">
          <Icon
            css={css`
              margin-bottom: -2px;
            `}
            fill={theme.colors.white}
            height="12px"
            name="file"
          />
          Start a New Application
        </Button>
      </div>
    </DashboardCard>
  );
};

export default StartApplication;
