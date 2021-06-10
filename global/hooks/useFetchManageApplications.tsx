import { APPLICATIONS_PATH } from 'global/constants/internalPaths';
import { ManageApplicationsRequestData } from '../../components/pages/Applications/ManageApplications/types';
import useAxios from './useAxios';

const useFetchManageApplications = ({
  page,
  pageSize,
  sort,
}: ManageApplicationsRequestData) => {
  const { error, isLoading, response } = useAxios({
    url: APPLICATIONS_PATH,
    params: {
      page,
      pageSize,
      sort: `${sort.map(({ field, order }) => `${field}:${order}`)}`,
    }
  });

  return { error, isLoading, response };
};

export default useFetchManageApplications;
