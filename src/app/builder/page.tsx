'use client';

import { useState } from 'react';

import { Stack, Paper, Container } from '@mui/material';

import FormBuilder from 'src/components/form-builder';
import WidgetPanel from 'src/components/widget-panel';

export default function Page() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleWidgetAdded = () => {
    setSelectedType(null); // Widget eklendikten sonra seçimi temizle
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" spacing={2}>
        <Stack flex={2}>
          <Paper elevation={4} sx={{ height: 300 }}>
            <WidgetPanel onSelect={setSelectedType} />
          </Paper>
        </Stack>
        <Stack flex={4}>
          <FormBuilder selectedType={selectedType} onWidgetAdded={handleWidgetAdded} />
        </Stack>
        <Stack flex={2} />
      </Stack>
    </Container>
  );
}
