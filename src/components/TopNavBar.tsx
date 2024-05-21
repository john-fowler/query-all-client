import React from 'react';
import { IconButton, Toolbar, Typography, styled } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { drawerWidth } from './LeftSideDrawer';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

interface TopNavBarProps {
    handleDrawerOpen: () => void;
    open: boolean;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ open, handleDrawerOpen }) => {
    return (
        <AppBar position='fixed' open={open}>
            <Toolbar>
                <IconButton
                    color='inherit'
                    aria-label='open drawer'
                    onClick={handleDrawerOpen}
                    edge='start'
                    sx={{ mr: 2, ...(open && { display: 'none' }) }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant='h6' noWrap component='div'>
                    QueryAll
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default TopNavBar;
