import React from 'react';
import Applications from './Applications';
import DashboardHeader from './Header';

const Dashboard = () => {
  return (
    <>
      <DashboardHeader />
      <Applications inProgressApplications={[]} />
    </>
  );
};

export default Dashboard;
