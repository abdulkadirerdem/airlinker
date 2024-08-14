import { useMemo } from 'react';

import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  data:
    | {
        _id: string;
        type: string;
        title: string;
        description: string;
        createdAt: string;
      }[]
    | undefined;
  error: any;
  selectedWorkspaceId: string | undefined;
};

export default function DataGridTable({ data, error, selectedWorkspaceId }: Props) {
  const router = useRouter();

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
            // sx={{ cursor: 'pointer' }}
            onClick={() => {
              console.info(router);
              router.push(`/form/${selectedWorkspaceId}/${params.id}`);
            }}
          >{`localhost:8083/form/${selectedWorkspaceId}/${params.id}`}</Button>
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
            icon={<Iconify icon="solar:eye-bold" />}
            label="View"
            onClick={() => console.info('VIEW', params.row.id)}
          />,
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="solar:pen-bold" />}
            label="Edit"
            onClick={() => console.info('EDIT', params.row.id)}
          />,
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="solar:trash-bin-trash-bold" />}
            label="Delete"
            onClick={() => console.info('DELETE', params.row.id)}
            sx={{ color: 'error.main' }}
          />,
        ],
      },
    ],
    [router, selectedWorkspaceId]
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
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((item) => Object({ ...item, id: item._id }))
            : []
        }
        disableRowSelectionOnClick
      />
    </Box>
  );
}
