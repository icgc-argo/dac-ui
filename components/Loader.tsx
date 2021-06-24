import { ReactElement } from 'react';
import { css } from '@emotion/core';
import DnaLoader from '@icgc-argo/uikit/DnaLoader';

const Loader = (): ReactElement => (
  <figure
    css={css`
      align-items: center;
      display: flex;
      height: 100%;
      justify-content: center;
    `}
  >
    <DnaLoader />
  </figure>
);

export default Loader;
