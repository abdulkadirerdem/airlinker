import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';

import useSubmitter from 'src/hooks/use-submitter';

import { endpoints } from 'src/utils/axios';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AddProductModal({ refetch }: { refetch: () => any }) {
  const { isLoading, success, submitData } = useSubmitter();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [productUrl, setProductUrl] = useState('');

  const handleAddProduct = async () => {
    await submitData([
      endpoints.products.addProduct,
      {
        data: {
          productUrl,
        },
      },
    ]);
  };

  useEffect(() => {
    if (success) {
      handleClose();
      refetch();
    }
  }, [refetch, success]);

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Add Product to Tracking List
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            Product Informations
          </Typography>
          <OutlinedInput
            fullWidth
            placeholder={"Type the product's URL."}
            sx={{ mb: 2 }}
            onChange={(e) => setProductUrl(e.target.value)}
          />
          {/* <OutlinedInput
            fullWidth
            placeholder="Ürün İsmi - Nike Air Force"
            sx={{ mb: 6 }}
            onChange={(e) => setProductUrl(e.target.value)}
          /> */}
          <Stack width="100%" alignItems="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProduct}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Add Product to Tracking List'}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
