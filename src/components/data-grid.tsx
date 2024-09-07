import { useMemo } from 'react';
import { Box, Button, useTheme, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation and useQueryClient

// Delete function import
import { deleteAirlink } from 'src/api/airlink/deleteAirlink'; // Adjust the path if needed

// ----------------------------------------------------------------------

type Props = {
  data:
  | {
    _id?: string;
    type: string;
    title: string;
    description: string;
    createdAt?: string;
  }[]
  | undefined;
  error: any;
  selectedWorkspaceId: string | undefined;
};

export default function DataGridTable({ data, error, selectedWorkspaceId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient(); // Initialize Query Client

  // Delete Mutation
  const deleteAirlinkMutation = useMutation({
    mutationFn: deleteAirlink,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['airlinks', selectedWorkspaceId]);
    },
    onError: (deleteError) => {
      console.error('Error deleting airlink:', deleteError);
    },
  });
  const theme = useTheme();

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'title',
        headerName: 'Title',
        flex: 2,
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 4,
      },
      {
        field: 'id',
        headerName: 'AirLink',
        flex: 5,
        renderCell: (params) => (
          <Button
            variant="text"
            onClick={() => {
              router.push(`/form/${selectedWorkspaceId}/${params.id}`);
            }}
          >{`localhost:8083/form/${selectedWorkspaceId}/${params.id}`}</Button>
        ),
      },
      {
        field: 'responses-field',
        headerName: 'Responses',
        align: 'center',
        headerAlign: 'center',
        flex: 3,
        renderCell: (params) => (
          <Button
            sx={{
              alignSelf: 'center',
              borderColor: theme.palette.primary.dark,
              color: theme.palette.primary.dark,
            }}
            variant="outlined"
            onClick={() => {
              router.push(`/responses/${selectedWorkspaceId}/${params.id}`);
            }}
          >
            Responses
          </Button>
        ),
      },
      {
        field: 'type',
        headerName: 'Type',
        flex: 1,
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: 'Actions',
        align: 'right',
        headerAlign: 'right',
        flex: 1,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        getActions: (params) => [
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="solar:trash-bin-trash-bold" />}
            label="Delete"
            onClick={() => deleteAirlinkMutation.mutate(params.row._id)} // Use mutation on click
            sx={{ color: 'error.main' }}
          />,
        ],
      },
    ],
    [router, selectedWorkspaceId, theme.palette.primary.dark, deleteAirlinkMutation]
  );

  if (error) {
    return <Typography color="error">Something went wrong!</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={
          data
            ? data
              .sort(
                (a, b) =>
                  new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
              )
              .map((item) => Object({ ...item, id: item._id }))
            : []
        }
        disableRowSelectionOnClick
      />
    </Box>
  );
}
