/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { createThread, sendMessage } from '../service/openAiApi';
import { setSql } from '../redux/sqlSlice';
import {
    Box,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    Stack,
} from '@mui/material';
import './ChatPane.css';

interface ChatPaneProps {
    height: number;
}

const ChatPane: React.FC<ChatPaneProps> = ({ height }) => {
    const dispatch = useDispatch<AppDispatch>();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [input, setInput] = useState('');
    const currentThread = useSelector(
        (state: RootState) => state.chat.currentThread,
    );
    const messages = useSelector(
        (state: RootState) =>
            state.chat.threads[currentThread!]?.messages || [],
    );

    useEffect(() => {
        // Initialize the assistant and thread on component mount
        const initializeChat = async () => {
            await createThread(dispatch);
        };

        if (!currentThread) {
            initializeChat();
        }
    }, [currentThread, dispatch]);

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        if (currentThread) {
            sendMessage(dispatch, currentThread, input);
        }
        setInput('');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleUseSql = useCallback(
        (sql: string) => {
            if (sql.charAt(sql.length - 1) === ';') {
                dispatch(setSql(sql.slice(0, -1)));
            } else {
                dispatch(setSql(sql));
            }
        },
        [dispatch],
    );

    const expandMarkdown = useCallback(
        (text: string) => {
            const splitText = text.split('```');
            return splitText.map((line, index) => {
                if (index % 2 === 0) {
                    return line.split('\n').map((l, i) => (
                        <p key={i} className='markdownText'>
                            {l}
                        </p>
                    ));
                }
                return (
                    <pre key={index} className='markdownCode'>
                        <Button
                            onClick={() => handleUseSql(line.trim())}
                            className='useSqlBtn'
                            size='small'
                            variant='outlined'>
                            use
                        </Button>
                        {line.trim()}
                    </pre>
                );
            });
        },
        [handleUseSql],
    );

    return (
        <Box
            sx={{
                height,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}>
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 2,
                    borderTop: 1,
                    borderLeft: 1,
                    borderColor: 'divider',
                }}>
                <List>
                    {messages.map((msg, index) =>
                        msg.sender === 'user' ? (
                            <ListItem
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                sx={{
                                    justifyContent: 'flex-end',
                                }}>
                                <ListItemText
                                    primary={msg.text}
                                    primaryTypographyProps={{
                                        align: 'right',
                                    }}
                                    sx={{
                                        color: 'white',
                                        flexGrow: 0,
                                        maxWidth: '60%',
                                        bgcolor: 'primary.light',
                                        borderRadius: 2,
                                        px: 2,
                                        py: 1,
                                    }}
                                />
                            </ListItem>
                        ) : (
                            <ListItem
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                sx={{
                                    justifyContent: 'flex-start',
                                }}>
                                <Stack
                                    direction='column'
                                    spacing={1}
                                    justifyContent='flex-start'
                                    alignContent='flex-start'
                                    sx={{
                                        marginRight: 10,
                                        border: 3,
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        p: 2,
                                    }}>
                                    {expandMarkdown(msg.text)}
                                </Stack>
                            </ListItem>
                        ),
                    )}
                    <div ref={messagesEndRef} />
                </List>
            </Box>
            <Box
                sx={{
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                <TextField
                    fullWidth
                    variant='outlined'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder='Type a message...'
                    sx={{ mr: 2 }}
                />
                <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSendMessage}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default ChatPane;
