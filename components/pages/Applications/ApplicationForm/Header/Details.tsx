import { ReactElement } from 'react';
import { css } from '@icgc-argo/uikit';
import Link from '@icgc-argo/uikit/Link';
import Typography from '@icgc-argo/uikit/Typography';

const HeaderDetails = ({
  applicant,
  createdAt,
  appId,
  lastUpdated,
}: {
  applicant?: string;
  createdAt?: string;
  appId: string;
  lastUpdated?: string;
}): ReactElement => (
  <section
    css={css`
      padding: 10px 0;
    `}
  >
    <Typography
      component="h1"
      css={css`
        font-size: 20px;
        margin: 0 0 5px;
      `}
    >
      <Link>My Applications</Link>: {appId.toUpperCase()}
    </Typography>

    {(createdAt || lastUpdated) && (
      <Typography
        component="p"
        css={css`
          font-size: 12px;
          margin: 0;

          span {
            font-weight: bold;
          }
        `}
        variant="paragraph"
      >
        {createdAt && (
          <>
            {'Created: '}
            <span>{createdAt}</span>
            {lastUpdated && ' | '}
          </>
        )}

        {lastUpdated && (
          <>
            {'Last Updated: '}
            <span>{lastUpdated}</span>
          </>
        )}
      </Typography>
    )}

    <Typography
      component="p"
      css={css`
        font-size: 12px;
        margin: 0;

        ${applicant &&
        `
          span {
            font-weight: bold;
          }
        `}
      `}
      variant="paragraph"
    >
      Applicant: <span>{applicant || 'to be specified'}</span>
    </Typography>
  </section>
);

export default HeaderDetails;
