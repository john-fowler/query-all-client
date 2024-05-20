import React from 'react';
import { IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface TopNavBarProps {
    handleDrawerOpen: () => void;
    open: boolean;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ open, handleDrawerOpen }) => {
  return (
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{ mr: 2, ...(open && { display: 'none' }) }}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap component="div">
        QueryAll for DynamoDB
      </Typography>
    </Toolbar>
  );
};

export default TopNavBar;