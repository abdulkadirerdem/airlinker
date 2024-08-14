'use client';

import { useState } from 'react';

import { Box, Stack, Paper, Divider, Container, Typography } from '@mui/material';

import { usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import FormBuilder from 'src/components/form-builder';
import WidgetPanel from 'src/components/widget-panel';

export default function Page() {
  const pathname = usePathname();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const lgUp = useResponsive('up', 'lg');

  const handleWidgetAdded = () => {
    setSelectedType(null); // Widget eklendikten sonra seçimi temizle
  };

  return (
    <Container maxWidth="xl">
      <Typography mt={0} mb={1} variant="h4">
        Builder
      </Typography>
      {lgUp && (
        <Box
          component="img"
          src="/assets/images/logo/airy.png"
          sx={{
            height: 85,
            mr: 2.5,
            position: 'absolute',
            top: 67,
            left: 220,
            zIndex: 9,
          }}
        />
      )}
      <Divider sx={{ mb: 3 }} />

      <Stack direction="row" spacing={2}>
        <Stack flex={2}>
          <Paper elevation={2} sx={{ height: 300 }}>
            <WidgetPanel onSelect={setSelectedType} />
          </Paper>
        </Stack>
        <Stack flex={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <FormBuilder
              selectedType={selectedType}
              onWidgetAdded={handleWidgetAdded}
              workspaceId={pathname.split('/')[2]}
            />
          </Paper>
        </Stack>
        <Stack flex={{ md: 0, lg: 2 }} />
      </Stack>
    </Container>
  );
}
