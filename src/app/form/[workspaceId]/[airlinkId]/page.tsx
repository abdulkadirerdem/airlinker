import { Container } from '@mui/material';

import FormContent from 'src/sections/form/FormContent';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Form',
};

export default function Page() {
  return (
    <Container maxWidth="md">
      <FormContent />
    </Container>
  );
}
