import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

export default function ProductList({
  products,
}:
  | {
      products: Array<{ productUrl: string; trackingStatus: string }>;
    }
  | any) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>URL</TableCell>
            <TableCell>Tracking Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((row: { productUrl: string; trackingStatus: string }) => (
            <TableRow
              key={row.productUrl}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{row.productUrl}</TableCell>
              <TableCell>{row.trackingStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
