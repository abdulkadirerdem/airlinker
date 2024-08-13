import { Box, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: One',
};

export default function Page() {
  return (
    <Stack direction="row">
      <Stack flex={1}>a</Stack>
      <Stack flex={4}>b</Stack>
      <Stack flex={1} />
    </Stack>
  );
}
