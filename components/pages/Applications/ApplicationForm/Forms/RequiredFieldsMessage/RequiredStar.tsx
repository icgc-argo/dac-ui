import { css } from '@icgc-argo/uikit';
import Typography from '@icgc-argo/uikit/Typography';

const RequiredStar = () => (
  <Typography
    bold
    color="error"
    component="span"
    css={css`
      font-size: 12px;
    `}
  >
    *
  </Typography>
);

export default RequiredStar;
