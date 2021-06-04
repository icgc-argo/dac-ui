import { css } from '@emotion/core';
import Typography from '@icgc-argo/uikit/Typography';

import RequiredStar from './RequiredStar';

const RequiredFieldsMessage = () => (
  <Typography
    as="figure"
    bold
    css={css`
      text-align: right;
      margin: 1em 0;
    `}
  >
    <RequiredStar /> Indicates required fields
  </Typography>
);

export default RequiredFieldsMessage;

export { default as RequiredStar } from './RequiredStar';
