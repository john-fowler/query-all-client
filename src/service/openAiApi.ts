/* eslint-disable no-console */
import { AppDispatch } from '../redux/store';
import {
    setCurrentThread,
    addThread,
    addMessage,
    Message,
    appendAssistantChunk,
    INITIAL_ASSISTANT_MESSAGE,
} from '../redux/chatSlice';
import socket from './socket'; // Import the socket instance
import { API_BASE_URL } from './serviceTypes';

export enum OPENAI_MODELS {
    GPT_4_O = 'gpt-4o', // $5/1M tokens, $15/1M tokens, 128k context window
    GPT_4_TURBO = 'gpt-4-turbo', // $10/1M tokens, $30/1M tokens, 128k context window
    GPT_4 = 'gpt-4', // $30/1M tokens, $60/1M tokens, 8k context window
    GPT_3_5_TURBO = 'gpt-3.5-turbo', // $0.50/1M tokens, $1.50/1M tokens, 16k context window
    GPT_3_5_TURBO_INSTRUCT = 'gpt-3.5-turbo-instruct', // $1.50/1M tokens, $2.00/1M tokens, 4k context window
}

// Message Response Event
type MessageResponse = {
    id: string;
    object: string;
    created: number;
    model: OPENAI_MODELS;
    system_fingerprint: string | null;
    choices: {
        index: number;
        logprobs: string | null;
        finish_reason: 'stop' | null;
        delta: {
            content?: string;
        };
    }[];
};

// Helper function to handle responses
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
};

// Create a Thread
export const createThread = async (dispatch: AppDispatch): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/threads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        const data = await handleResponse(response);
        console.log('Thread created: ', JSON.stringify(data));
        const { threadId } = data;
        dispatch(
            addThread({
                id: threadId,
                messages: [
                    {
                        sender: 'assistant',
                        text: INITIAL_ASSISTANT_MESSAGE,
                        timestamp: Date.now(),
                    },
                ],
            }),
        );
        dispatch(setCurrentThread(threadId));
        return threadId;
    } catch (error) {
        console.error('Error creating thread:', error);
    }
    return 'placeholder';
};

// Send a Message
export const sendMessage = async (
    dispatch: AppDispatch,
    threadId: string,
    messageText: string,
) => {
    let tid = threadId;
    if (threadId === 'placeholder') {
        tid = await createThread(dispatch);
    }

    const message: Message = {
        sender: 'user',
        text: messageText,
        timestamp: Date.now(),
    };
    dispatch(addMessage({ threadId: tid, message }));

    socket.emit('sendMessage', { content: messageText, threadId: tid });

    socket.on('receiveMessage', (data: MessageResponse) => {
        // console.log('Received message:', data);
        if (data.choices[0].delta.content) {
            dispatch(
                appendAssistantChunk({
                    threadId: tid,
                    content: data.choices[0].delta.content,
                }),
            );
        }

        if (data.choices[0].finish_reason === 'stop') {
            socket.off('receiveMessage');
        }
    });
};
