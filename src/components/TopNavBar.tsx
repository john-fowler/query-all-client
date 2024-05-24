import React from 'react';
import { IconButton, Toolbar, Typography, styled } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChatOffIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatOnIcon from '@mui/icons-material/Chat';
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
    drawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
    chatOpen: boolean;
    setChatOpen: (open: boolean) => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({
    drawerOpen,
    setDrawerOpen,
    chatOpen,
    setChatOpen,
}) => {
    return (
        <AppBar position='fixed' open={drawerOpen}>
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <IconButton
                    color='inherit'
                    aria-label='open drawer'
                    onClick={() => setDrawerOpen(!drawerOpen)}
                    edge='start'
                    sx={{ mr: 2 }}>
                    {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
                <Typography variant='h6' noWrap component='div'>
                    QueryAll
                </Typography>
                <IconButton
                    color='inherit'
                    aria-label='open chat'
                    onClick={() => setChatOpen(!chatOpen)}
                    edge='start'
                    sx={{ mr: 2 }}>
                    {chatOpen ? <ChatOnIcon /> : <ChatOffIcon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default TopNavBar;
