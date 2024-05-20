import React, {  } from 'react';
import { Divider, Drawer, IconButton, useTheme } from '@mui/material';
import DrawerHeader from './DrawerHeader';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TableSelector from './TableSelector';

export const drawerWidth = 400;

interface LeftSideDrawerProps {
    handleDrawerClose: () => void;
    open: boolean;
}

const LeftSideDrawer: React.FC<LeftSideDrawerProps> = ({ open, handleDrawerClose }) => {
    const theme = useTheme();
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <TableSelector />
    </Drawer>
  );
};

export default LeftSideDrawer;
