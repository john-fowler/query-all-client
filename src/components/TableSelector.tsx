import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography, styled } from '@mui/material';
import MuiList from '@mui/material/List';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { getTableDetails, listTables } from '../apiService';
import { AppDispatch, RootState } from '../redux/store';
import { setTables, updateTable } from '../redux/catalogSlice';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import KeyIcon from '@mui/icons-material/Key';
import { HashKeyAndSortIndexMetadata, IndexMetadata, PK_INDEX_NAME } from '../types';
import { insertSqlToken } from '../redux/sqlSlice';

interface TableSelectorProps {
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));



const List = styled(MuiList)<{ component?: React.ElementType }>({
    '& .MuiListItemButton-root': {
        marginLeft: 0,
        paddingLeft: 0,
        paddingRight: 36,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 48,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 20,
    },
    '& .MuiListItemText-primary': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
});

const TableSelector: React.FC<TableSelectorProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [expanded, setExpanded] = React.useState<string | false>('~~~');
    const { tables, tableFilter } = useSelector((state: RootState) => state.catalog);
    const [ pkColumns, setPkColumns ] = React.useState<string[]>([]);

    const tablesToDisplay = useMemo(() => {
        return tables.filter((table) => table.name.toLowerCase().includes(tableFilter.toLowerCase()));
    }, [tables, tableFilter]);

    useEffect(() => {
        try {
            listTables().then((result) => {
                dispatch(setTables(result.data));
            });
        }
        catch (error: Error | any) {
            console.error('Error fetching tables:', error);
            alert('Error fetching tables: ' + error.message);
        }
    }, [dispatch]);

    useEffect(() => {
        const tab = tables.find((table) => table.name === expanded);
        if (tab) {
            if (tab.columns.length === 0) {
                getTableDetails(tab.name).then((result) => {
                    dispatch(updateTable(result.data));
                });
            }
            else {
                const pkIndex: IndexMetadata | undefined = tab.indexes.find((index) => index.name === PK_INDEX_NAME);
                if ('hashKeyName' in (pkIndex ?? {})) {
                    const pkHashIndex: HashKeyAndSortIndexMetadata = pkIndex as HashKeyAndSortIndexMetadata;
                    setPkColumns([pkHashIndex.hashKeyName, pkHashIndex.sortKeyName || '']); 
                }
            }
        }
    }, [dispatch, expanded, tables]);

    const handleChange =
      (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
      };

      const handleTokenClick = (token: string) => {
        dispatch(insertSqlToken({token}));
    }
  return (
    <div>
        {
            tablesToDisplay.map((table) => {
                return (
                    <Accordion key={table.name} expanded={expanded === table.name} onChange={handleChange(table.name)}>
                        <AccordionSummary aria-controls={table.name + "d-content"} id={table.name + "d-header"}>
                            <Stack direction='row' alignItems='center' justifyContent='space-between' flex={1} sx={{ paddingRight: '12px' }}>
                                <Typography>{table.name}</Typography>
                                <IconButton edge="end" aria-label="fill" onClick={(event: React.MouseEvent) => {
                                    event.stopPropagation();
                                    handleTokenClick(table.name);
                                }}>
                                    <ArrowRightIcon />
                                </IconButton>

                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            {
                                table.columns.length > 0 ? 
                                <List>
                                    {table.columns.map((column) =>
                                            <ListItem key={column.name} disablePadding
                                                secondaryAction={
                                                <IconButton edge="end" aria-label="fill">
                                                    <ArrowRightIcon />
                                                </IconButton>
                                            }
                                            onClick={(event: React.MouseEvent) => {
                                                event.stopPropagation();
                                                handleTokenClick(column.name);
                                            }}
                                            >
                                                { pkColumns.includes(column.name) ? 
                                                    <ListItemIcon>
                                                        <KeyIcon />
                                                    </ListItemIcon>
                                                    : 
                                                    <ListItemIcon/>
                                                }
                                                <ListItemButton>
                                                    <ListItemText primary={column.name} />
                                                </ListItemButton>
                                            </ListItem>
                                    )}
                                </List>
                                 :
                                <Typography>
                                    Loading...
                                </Typography>
                            }
                        </AccordionDetails>
                    </Accordion>
                );
            })
        }
    </div>
  );
};

export default TableSelector;