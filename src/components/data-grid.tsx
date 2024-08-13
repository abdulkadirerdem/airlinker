import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 160,
    editable: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 360,
    editable: true,
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 160,
    editable: true,
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: 'Actions',
    align: 'right',
    headerAlign: 'right',
    width: 80,
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
    <Box sx={{ px: 2, width: 'fit-content' }}>
      <DataGrid
        columns={columns}
        rows={data ? data.map((item) => Object({ ...item, id: item._id })) : []}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
