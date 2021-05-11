import React from 'react';
import NextHead from 'next/head';

const Head = () => {
  return (
    <NextHead>
      <link
        href={'https://fonts.googleapis.com/css?family=Lato:300,400,600&display=swap'}
        rel="stylesheet"
      />
      <link rel="shortcut icon" href={`/images/favicon.ico`} />
    </NextHead>
  );
};

export const PageHead = ({ title = '' }: { title?: string }) => {
  return (
    <NextHead>
      <title>ICGC-DACO{` ${title ? `| ${title}` : ''}`}</title>
    </NextHead>
  );
};

export default Head;
