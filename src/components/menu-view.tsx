'use client';

import { Dispatch, SetStateAction } from 'react';

import { Box, Select, MenuItem, Typography, InputLabel, FormControl, useTheme } from '@mui/material';

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
  const theme = useTheme()
  const handleChange = (event: any) => {
    setSelectedIndex(event.target.value);
  };

  if (error) {
    return <Typography color="error">Something went wrong!</Typography>;
  }

  return (
    <Box width="fit-content" mb={2} mt={2} minWidth={250}>
      <FormControl fullWidth>
        <InputLabel id="select-label" sx={{ background: "white", px: 1 }}>Workspaces</InputLabel>
        <Select
          sx={{
            backgroundColor: 'white',
            borderColor: theme.palette.primary.darker,
            borderStyle: "solid",
            borderWidth: 0.3,
            color: "black",
            borderRadius: 0.5
          }}
          labelId="select-label"
          id="select"
          size="small"
          value={selectedIndex}
          onChange={handleChange}
          label="Workspaces"
        >
          {data.map((option: any, index: number) => (
            <MenuItem key={option?._id} value={index} sx={{ borderRadius: 0.5, borderColor: "black", }}>
              {option?.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
