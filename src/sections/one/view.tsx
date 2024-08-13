'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import Container from '@mui/material/Container';

import { getAllWorkspaces } from 'src/api/workspace/getAllWorkspaces';
import { getAllAirlinksByWorkspace } from 'src/api/airlink/getAllAirlinksByWorkspace';

import MenuView from 'src/components/menu-view';
import DataGridTable from 'src/components/data-grid';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data, error, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const result = await getAllWorkspaces();
      console.log('Workspaces Data:', result); // Veriyi kontrol edin
      return result;
    },
  });

  const selectedWorkspaceId = data?.[selectedIndex]?._id;

  const {
    data: airlinkData,
    error: airlinkError,
    isLoading: isAirlinkLoading,
    refetch: refetchAirlinks,
  } = useQuery({
    queryKey: ['airlinks'],
    queryFn: async () => {
      const result = await getAllAirlinksByWorkspace(selectedWorkspaceId);
      console.log('Airlinks Data:', result); // Veriyi kontrol edin
      return result;
    },
    enabled: !!selectedWorkspaceId,
  });

  useEffect(() => {
    if (selectedWorkspaceId) {
      refetchAirlinks();
    }
  }, [selectedWorkspaceId, refetchAirlinks]);

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

      {isAirlinkLoading ? (
        'Loading...'
      ) : (
        <DataGridTable data={airlinkData || []} error={airlinkError} />
      )}
    </Container>
  );
}
