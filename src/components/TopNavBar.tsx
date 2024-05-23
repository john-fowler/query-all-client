import React from 'react';
import { IconButton, Toolbar, Typography, styled } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
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
    handleDrawerOpen: () => void;
    drawerOpen: boolean;
    chatOpen: boolean;
    setChatOpen: (open: boolean) => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({
    drawerOpen,
    handleDrawerOpen,
    chatOpen,
    setChatOpen,
}) => {
    return (
        <AppBar position='fixed' open={drawerOpen}>
            <Toolbar>
                <IconButton
                    color='inherit'
                    aria-label='open drawer'
                    onClick={handleDrawerOpen}
                    edge='start'
                    sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}>
                    <MenuIcon />
                </IconButton>
                <IconButton
                    color='inherit'
                    aria-label='open chat'
                    onClick={() => setChatOpen(!chatOpen)}
                    edge='start'
                    sx={{ mr: 2 }}>
                    {chatOpen ? <ChatOnIcon /> : <ChatOffIcon />}
                </IconButton>
                <Typography variant='h6' noWrap component='div'>
                    QueryAll
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default TopNavBar;
