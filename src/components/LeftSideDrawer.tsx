import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { Divider, Drawer, IconButton } from '@mui/material';
import DrawerHeader from './DrawerHeader';
import TableSelector from './TableSelector';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { setTableFilter } from '../redux/catalogSlice';

export const drawerWidth = 340;

interface LeftSideDrawerProps {
    open: boolean;
}

const LeftSideDrawer: React.FC<LeftSideDrawerProps> = ({ open }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { tableFilter } = useSelector((state: RootState) => state.catalog);

    const setFilter = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(setTableFilter(event.target.value || ''));
        },
        [dispatch],
    );

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
            variant='persistent'
            anchor='left'
            open={open}>
            <DrawerHeader>
                <Paper
                    component='form'
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: 400,
                    }}>
                    <IconButton
                        type='button'
                        sx={{ p: '10px' }}
                        aria-label='search'
                        disabled>
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder='Search Tables'
                        inputProps={{ 'aria-label': 'search tables' }}
                        value={tableFilter}
                        onChange={setFilter}
                    />
                    <IconButton
                        type='button'
                        sx={{ p: '10px' }}
                        aria-label='clear'
                        onClick={() => dispatch(setTableFilter(''))}>
                        <HighlightOffIcon />
                    </IconButton>
                </Paper>
            </DrawerHeader>
            <Divider />
            <TableSelector />
        </Drawer>
    );
};

export default LeftSideDrawer;
