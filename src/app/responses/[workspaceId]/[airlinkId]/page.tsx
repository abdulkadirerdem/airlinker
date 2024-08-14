import { Container } from '@mui/material';

import ResponseContent from 'src/sections/responses/ResponseContent';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Form',
};

export default function Page() {
  return (
    <Container maxWidth="md">
      <ResponseContent />
    </Container>
  );
}
