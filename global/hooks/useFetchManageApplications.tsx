import { APPLICATIONS_PATH } from 'global/constants/internalPaths';

import { ApplicationsRequestData } from '../../components/pages/Applications/ManageApplications/types';
import useAxios from './useAxios';

const useFetchManageApplications = ({
  page,
  pageSize,
  sort,
}: ApplicationsRequestData) => {
  const { error, loading, response } = useAxios({
    url: APPLICATIONS_PATH,
    data: {
      page,
      pageSize,
      sort,
    }
  });

  return { error, loading, response };
};

export default useFetchManageApplications;
