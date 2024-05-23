import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { createThread, sendMessage } from '../service/openAiApi';
import {
    Box,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import './ChatPane.css';

const ChatPane: React.FC = () => {
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

        initializeChat();
    }, [dispatch]);

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

    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRight: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
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
                                <ListItemText
                                    primary={msg.text}
                                    primaryTypographyProps={{
                                        align: 'left',
                                    }}
                                    sx={{
                                        maxWidth: '90%',
                                        bgcolor: 'secondary.light',
                                        borderRadius: 2,
                                        px: 2,
                                        py: 1,
                                    }}
                                />
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
