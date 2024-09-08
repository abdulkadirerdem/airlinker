import toast from 'react-hot-toast';
import { useState } from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';

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

export default function AddWorkspaceModal({
  isPending,
  mutateAsync,
  WorkspaceRefetch,
}: {
  isPending: boolean;
  mutateAsync: ({ title, description }: { title: string; description: string }) => any;
  WorkspaceRefetch: () => any;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [workspaceTitle, setWorkspaceTitle] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');

  return (
    <>
      <Button
        variant="contained"
        sx={{ marginLeft: 'auto', mt: 1, borderRadius: 0.5 }}
        color="primary"
        onClick={handleOpen}
      >
        Add Workspace
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            Workspace Informations
          </Typography>
          <OutlinedInput
            size="medium"
            fullWidth
            placeholder="Workspace Name"
            sx={{ mb: 1 }}
            onChange={(e) => setWorkspaceTitle(e.target.value)}
          />
          <OutlinedInput
            size="medium"
            fullWidth
            placeholder="Workspace Description"
            sx={{ mb: 2 }}
            onChange={(e) => setWorkspaceDescription(e.target.value)}
          />
          <Stack width="100%" alignItems="flex-end">
            <Button
              variant="contained"
              color="primary"
              disabled={isPending}
              onClick={() => {
                mutateAsync({ title: workspaceTitle, description: workspaceDescription }).then(
                  () => {
                    toast.success('Workspace created.', { duration: 2000 });
                    WorkspaceRefetch();
                    handleClose();
                  }
                );
              }}
            >
              {isPending ? 'Loading...' : 'Add Workspace'}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
