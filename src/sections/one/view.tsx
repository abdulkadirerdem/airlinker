'use client';

import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import useFetcher from 'src/hooks/use-fetcher';

import { endpoints } from 'src/utils/axios';

import MenuView from 'src/components/menu-view';
import DataGridTable from 'src/components/data-grid';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data, error, isLoading } = useFetcher(endpoints.workspaces.getAllWorkspaces);
  const airlinkArgs = data?.[selectedIndex]?._id
    ? `${endpoints.airlinks.getAirlinksByWorkstations}/${data[selectedIndex]._id}`
    : null;
  const {
    data: airlinkData,
    error: airlinkError,
    isLoading: isAirlinkLoading,
    refetch,
  } = useFetcher(airlinkArgs);

  useEffect(() => {
    if (!isLoading) refetch();
  }, [isLoading, refetch, selectedIndex]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {isLoading ? (
        'Loading...'
      ) : (
        <MenuView
          data={data}
          error={error}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )}

      {isAirlinkLoading ? 'Loading...' : <DataGridTable data={airlinkData} error={airlinkError} />}

      {/* <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      /> */}
    </Container>
  );
}
