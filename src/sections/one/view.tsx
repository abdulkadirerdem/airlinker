'use client';

import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import Container from '@mui/material/Container';
import { Box, Grid, Paper, Stack, Button, useTheme, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { createWorkspace } from 'src/api/workspace/createWorkspace';
import { getAllWorkspaces } from 'src/api/workspace/getAllWorkspaces';
import { getAllAirlinksByWorkspace } from 'src/api/airlink/getAllAirlinksByWorkspace';

import MenuView from 'src/components/menu-view';
import DataGridTable from 'src/components/data-grid';
import { useSettingsContext } from 'src/components/settings';
import AddWorkspaceModal from 'src/components/add-workspace-modal';

// ----------------------------------------------------------------------

export default function OneView() {
  const router = useRouter();
  const theme = useTheme();
  const settings = useSettingsContext();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const lgUp = useResponsive('up', 'lg');

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['create-workspace'],
    mutationFn: createWorkspace,
  });

  const {
    data,
    error,
    isLoading,
    refetch: WorkspaceRefetch,
  } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getAllWorkspaces,
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
      {lgUp && (
        <Box
          component="img"
          src="/assets/images/logo/airy.png"
          sx={{
            height: 88,
            mr: 2.5,
            position: 'absolute',
            top: 86,
            right: 270,
            zIndex: 1300,
            transform: 'scaleX(-1)',
          }}
        />
      )}
      {isLoading ? (
        'Loading...'
      ) : (
        <Stack direction="row" width="100%" alignItems="center">
          <MenuView
            data={data}
            error={error}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
          <AddWorkspaceModal
            isPending={isPending}
            mutateAsync={mutateAsync}
            WorkspaceRefetch={WorkspaceRefetch}
          />
        </Stack>
      )}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Paper
            component={Button}
            fullWidth
            elevation={2}
            sx={{
              height: 100,
              borderRadius: 0.5,
              border: `1px solid ${theme.palette.primary.dark}`,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 500,
            }}
            onClick={() => {
              router.push(`${paths.builder.form}/${selectedWorkspaceId}`);
            }}
          >
            <Icon icon="mdi:form-outline" fontSize={40} color={theme.palette.primary.dark} />
            <Typography fontSize={14} fontWeight="600" color={theme.palette.primary.dark}>
              Form
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            component={Button}
            fullWidth
            elevation={2}
            sx={{
              height: 100,
              borderRadius: 0.5,
              border: `1px solid ${theme.palette.primary.dark}`,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 500,
            }}
            onClick={() => {
              router.push(`${paths.builder.quiz}/${selectedWorkspaceId}`);
            }}
          >
            <Icon icon="mdi:quiz-outline" fontSize={40} color={theme.palette.primary.dark} />
            <Typography fontSize={14} fontWeight="600" color={theme.palette.primary.dark}>
              Quiz
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            component={Button}
            fullWidth
            elevation={2}
            sx={{
              height: 100,
              borderRadius: 0.5,
              border: `1px solid ${theme.palette.primary.dark}`,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 500,
            }}
            onClick={() => {
              router.push(`${paths.builder.raffle}/${selectedWorkspaceId}`);
            }}
          >
            <Icon icon="fad:random-2dice" fontSize={45} color={theme.palette.primary.dark} />
            <Typography fontSize={14} fontWeight="600" color={theme.palette.primary.dark}>
              Raffle
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {isAirlinkLoading ? (
        'Loading...'
      ) : (
        <DataGridTable
          data={airlinkData || []}
          error={airlinkError}
          selectedWorkspaceId={selectedWorkspaceId}
        />
      )}
    </Container>
  );
}
