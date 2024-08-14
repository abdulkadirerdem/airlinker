'use client';

import { Box } from '@mui/material';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';
import BuilderNavHorizontal from 'src/layouts/dashboard/builder-nav-horizontal';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const renderHorizontal = <BuilderNavHorizontal />;

  return (
    <AuthGuard>
      {/* {renderHorizontal} */}
      {/* <Box mt={10}>Builder</Box> */}
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
