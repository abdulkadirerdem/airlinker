'use client';

import { useQuery } from '@tanstack/react-query';

import { Paper, Typography } from '@mui/material';

import { usePathname } from 'src/routes/hooks';

import { getAllAirlinksByWorkspace } from 'src/api/airlink/getAllAirlinksByWorkspace';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Form',
};

export default function ResponseContent() {
  const pathname = usePathname();
  const workspaceId = pathname.split('/')[2];
  const airlinkId = pathname.split('/')[3];

  const {
    data,
    error: queryError,
    isLoading,
  } = useQuery({
    queryKey: ['airlinks'],
    queryFn: async () => {
      const result = await getAllAirlinksByWorkspace(workspaceId);
      return result;
    },
  });

  if (queryError) {
    return <p style={{ padding: 5 }}>Something went wrong!</p>;
  }

  const formData: any =
    !isLoading && data !== undefined ? data.filter((item) => item?._id === airlinkId)[0] : [];

  if (isLoading) return 'Loading...';

  return (
    <Paper elevation={12} sx={{ p: 2, px: 4, mt: 4 }}>
      <Typography variant="h3" gutterBottom textAlign="right">
        Airlinker
      </Typography>
      <Typography variant="h4" gutterBottom>
        {formData.form.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {formData.form.description}
      </Typography>
    </Paper>
  );
}
