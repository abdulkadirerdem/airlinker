import { useMemo } from 'react';
import { Box, Button, useTheme, Typography, Chip, Alert } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation and useQueryClient

// Delete function import
import { deleteAirlink } from 'src/api/airlink/deleteAirlink'; // Adjust the path if needed
import toast from 'react-hot-toast';

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
      // @ts-ignore
      queryClient.invalidateQueries(['airlinks', selectedWorkspaceId]);
    },
    onError: (deleteError) => {
      console.error('Error deleting airlink:', deleteError);
    },
  });
  const theme = useTheme();

  const iconSwitch = (key: string) => {
    switch (key) {
      case "raffle":
        return "fad:random-2dice"
      case "quiz":
        return "mdi:quiz-outline"
      default:
        return "mdi:form-outline"
    }
  }

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
        flex: 2,
        renderCell: (params) => {
          const link = `https://airlinker.vercel.app/${params.row.type}/${selectedWorkspaceId}/${params.id}`;
          return (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%" gap={1}>
              <Button
                variant="text"
                onClick={() => {
                  router.push(`/${params.row.type}/${selectedWorkspaceId}/${params.id}`);
                }}
              >
                Go to Link
              </Button>
              <Button
                variant="text"
                onClick={(event) => {
                  event.stopPropagation();
                  navigator.clipboard.writeText(link);
                  toast.success("Copied!", {
                    position: "bottom-right"
                  });
                }}
              >
                <Iconify icon="material-symbols:content-copy" />
              </Button>
            </Box>
          );
        },
      },


      {
        field: 'responses-field',
        headerName: 'Responses',
        align: 'center',
        headerAlign: 'center',
        flex: 2,
        renderCell: (params) => (
          <Button
            sx={{
              alignSelf: 'center',
              borderColor: theme.palette.primary.dark,
              color: theme.palette.primary.dark,
              borderRadius: 0.5
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
        align: 'center',
        headerAlign: 'center',
        flex: 1.25,
        renderCell: (params) => (
          <Chip
            // @ts-ignore
            avatar={<Iconify icon={iconSwitch(params.row.type)} />}
            label={<p style={{ textTransform: "capitalize" }}> {params.row.type}</p>}
            variant="outlined"
            sx={{ borderRadius: 0.5 }}
          />
        ),
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: 'Actions',
        align: 'center',
        headerAlign: 'center',
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

