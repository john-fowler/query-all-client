import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    useTheme,
} from '@mui/material';
import { setSql, setSelection, setMaxRows } from '../redux/sqlSlice';
import './SqlInputArea.css';
import { cancelExecution } from '../service/executeSql';

interface SqlInputAreaProps {
    handleGo: () => void;
    handlePlan: () => void;
}

const SqlInputArea: React.FC<SqlInputAreaProps> = ({
    handleGo,
    handlePlan,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();
    const inputRef = React.useRef(null);
    const { sql, maxRows, executing } = useSelector(
        (state: RootState) => state.sql,
    );

    const updateSelectionRange = useCallback(() => {
        if (inputRef.current !== null) {
            const selectionStart =
                (inputRef.current as HTMLInputElement).selectionStart ?? 0;
            const selectionEnd =
                (inputRef.current as HTMLInputElement).selectionEnd ?? 0;
            dispatch(setSelection({ selectionStart, selectionEnd }));
        }
    }, [dispatch]);

    const handleSqlChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newSql = event.target.value;
            dispatch(setSql(newSql));
            localStorage.setItem('sql', newSql); // Save to local storage
            updateSelectionRange();
        },
        [dispatch, updateSelectionRange],
    );

    const handleMaxRowsChange = useCallback(
        (event: SelectChangeEvent<number>) => {
            dispatch(setMaxRows(Number(event.target.value)));
        },
        [dispatch],
    );

    const handleCancel = useCallback(() => {
        // eslint-disable-next-line no-console
        cancelExecution();
    }, []);

    useEffect(() => {
        const savedSql = localStorage.getItem('sql');
        if (savedSql) {
            dispatch(setSql(savedSql));
        }
    }, [dispatch]);

    return (
        <Box className='sql-input-container'>
            <Box
                className='flex-item'
                sx={{ border: 1, borderColor: theme.palette.divider }}>
                <TextField
                    variant='standard'
                    multiline
                    fullWidth
                    placeholder='SELECT * FROM ...'
                    value={sql}
                    onChange={handleSqlChange}
                    onClick={updateSelectionRange}
                    onFocus={updateSelectionRange}
                    onKeyUp={updateSelectionRange}
                    inputRef={inputRef}
                    InputProps={{
                        disableUnderline: true,
                        style: {
                            height: '100%',
                            padding: '10px',
                            alignItems: 'flex-start',
                            fontFamily: 'Courier New, Courier, monospace', // Apply monospace font directly
                        },
                    }}
                    style={{
                        overflow: 'auto',
                    }}
                    className='sql-textarea'
                />
            </Box>
            <Box className='buttons-dropdown-container'>
                <Box className='buttons-container'>
                    {executing ? (
                        <Button
                            variant='contained'
                            color='secondary'
                            onClick={handleCancel}
                            className='button'>
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: 'white',
                                    marginRight: '8px',
                                }}
                            />
                            Cancel
                        </Button>
                    ) : (
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleGo}
                            className='button'>
                            Go
                        </Button>
                    )}
                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={handlePlan}
                        className='button'>
                        Plan
                    </Button>
                </Box>
                <Box className='dropdown-container'>
                    <FormControl variant='outlined' className='dropdown'>
                        <InputLabel>Rows per page</InputLabel>
                        <Select
                            value={maxRows}
                            onChange={handleMaxRowsChange}
                            label='Rows per page'>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={250}>250</MenuItem>
                            <MenuItem value={500}>500</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        </Box>
    );
};

export default SqlInputArea;
