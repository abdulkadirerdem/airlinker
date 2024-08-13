'use client';

import React from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import useFetcher from 'src/hooks/use-fetcher';

import { endpoints } from 'src/utils/axios';

import ProductList from 'src/components/product-list';
import { useSettingsContext } from 'src/components/settings';
import AddProductModal from 'src/components/add-product-modal';

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();

  const { data, error, isLoading, refetch } = useFetcher(endpoints.products.getAllProducts);

  // Determine the content to display based on the state
  let content;

  if (isLoading) {
    content = <Typography>Loading...</Typography>;
  } else if (error) {
    content = <Typography color="error">{error}</Typography>;
  } else {
    content = <ProductList products={data} />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Products</Typography>
        <AddProductModal refetch={refetch} />
      </Stack>
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          p: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        {content}
      </Box>
    </Container>
  );
}
