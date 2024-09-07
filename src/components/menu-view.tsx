'use client';

import { Dispatch, SetStateAction } from 'react';

import { Box, Select, MenuItem, Typography, InputLabel, FormControl } from '@mui/material';

// ----------------------------------------------------------------------

export default function MenuView({
  data,
  error,
  selectedIndex = 0,
  setSelectedIndex,
}: {
  data: any;
  error: any;
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
}) {
  const handleChange = (event: any) => {
    setSelectedIndex(event.target.value);
  };

  if (error) {
    return <Typography color="error">Something went wrong!</Typography>;
  }

  return (
    <Box width="fit-content" mb={2} mt={2} minWidth={250}>
      <FormControl fullWidth>
        <InputLabel id="select-label">Workspaces</InputLabel>
        <Select
          sx={{
            backgroundColor: 'white',
          }}
          labelId="select-label"
          id="select"
          size="small"
          value={selectedIndex}
          onChange={handleChange}
          label="Workspaces"
        >
          {data.map((option: any, index: number) => (
            <MenuItem key={option?._id} value={index}>
              {option?.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
