'use client';

import { Container } from '@mui/material';

import DashboardLayout from 'src/layouts/dashboard';

import ResponseContent from 'src/sections/responses/ResponseContent';

// ----------------------------------------------------------------------

// export const metadata = {
//   title: 'Form',
// };

export default function Page() {
  return (
    <Container maxWidth="md">
      <DashboardLayout>
        <ResponseContent />
      </DashboardLayout>
    </Container>
  );
}
