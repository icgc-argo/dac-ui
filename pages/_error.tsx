import GenericError from 'components/pages/Error/Generic';
import React from 'react';

function Error({ statusCode }: { statusCode: string }) {
  return <GenericError />;
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
