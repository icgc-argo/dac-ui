import DashboardCard from '../Card';

type InProgressProps = {
  applicationNumber: string;
  institution: string;
};

const InProgress = ({
  applicationNumber = 'DACO-XXXXXX',
  institution = 'Institution: to be specified',
}: InProgressProps) => (
  <DashboardCard
    title={`Application: ${applicationNumber}`}
    subtitle={institution}
    info={`Access Expiry: May. 28, 2022`}
  >
    <div>In Progress applications</div>
  </DashboardCard>
);

export default InProgress;
