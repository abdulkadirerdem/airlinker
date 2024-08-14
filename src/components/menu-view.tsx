'use client';

import { useState, Dispatch, useCallback, SetStateAction } from 'react';

import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import { Box, Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

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
  const [isOpenList, setOpenList] = useState<null | HTMLElement>(null);

  const handleClickListItem = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setOpenList(event.currentTarget);
  }, []);

  const handleMenuItemClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, index: number) => {
      setSelectedIndex(index);
      setOpenList(null);
    },
    [setSelectedIndex]
  );

  const handleClose = useCallback(() => {
    setOpenList(null);
  }, []);

  if (error) {
    return <Typography color="error">Something went wrong!</Typography>;
  }

  return (
    <Box width="fit-content" mb={2}>
      <List component="nav">
        <ListItemButton
          aria-haspopup="true"
          aria-controls="lock-menu"
          onClick={handleClickListItem}
        >
          <ListItemText primary={data[selectedIndex]?.title} secondary="Workspaces" />
        </ListItemButton>
      </List>

      <Menu id="lock-menu" anchorEl={isOpenList} onClose={handleClose} open={Boolean(isOpenList)}>
        {data.map((option: any, index: number) => (
          <MenuItem
            key={option?._id}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option?.title}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
