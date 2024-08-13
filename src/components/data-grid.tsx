import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    flex: 2,
    editable: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 4,
    editable: true,
  },
  {
    field: 'id',
    headerName: 'AirLink',
    flex: 5,
    editable: true,
    renderCell: (params) => `localhost:8083/${params.id}`,
  },
  {
    field: 'type',
    headerName: 'Type',
    flex: 1,
    editable: true,
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
];

type Props = {
  data:
    | {
        _id: string;
        type: string;
        title: string;
        description: string;
      }[]
    | undefined;
  error: any;
};

export default function DataGridTable({ data, error }: Props) {
  if (error) {
    return <Typography color="error">Something went wrong!</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={data ? data.map((item) => Object({ ...item, id: item._id })) : []}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
