import GenericError from 'components/pages/Error/Generic';
import { NextPageContext } from 'next';
import Page403 from './403';
import Page404 from './404';

function Error({ statusCode }: { statusCode: number }) {
  switch (statusCode) {
    case 404:
      return <Page404 />;
    case 403:
      return <Page403 />;
    default:
      return <GenericError />;
  }
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
