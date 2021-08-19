import NextHead from 'next/head';

const Head = () => {
  return (
    <NextHead>
      <link
        href={'https://fonts.googleapis.com/css?family=Work+Sans:300,400,600&display=swap'}
        rel="stylesheet"
      />
      <link rel="shortcut icon" href="/favicon.ico" />
    </NextHead>
  );
};

export const PageHead = ({ title = '' }: { title?: string }) => {
  return (
    <NextHead>
      <title>{`${title ? `${title} | ` : ''}ICGC-DACO`}</title>
    </NextHead>
  );
};

export default Head;
