import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MessageRole = 'system' | 'user' | 'assistant';

export const INITIAL_ASSISTANT_MESSAGE =
    "Hello! I'm your SQL Assistant. How can I help you today?";

export interface Message {
    sender: MessageRole;
    text: string;
    timestamp: number;
}

interface Thread {
    id: string;
    messages: Message[];
}

interface ChatState {
    threads: Record<string, Thread>;
    currentThread: string | null;
}

const initialState: ChatState = {
    threads: {
        placeholder: {
            id: 'placeholder',
            messages: [
                {
                    sender: 'assistant',
                    text: INITIAL_ASSISTANT_MESSAGE,
                    timestamp: Date.now(),
                },
            ],
        },
    },
    currentThread: 'placeholder',
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentThread(state, action: PayloadAction<string>) {
            state.currentThread = action.payload;
        },
        addThread(state, action: PayloadAction<Thread>) {
            const { id } = action.payload;
            state.threads[id] = action.payload;
        },
        addMessage(
            state,
            action: PayloadAction<{ threadId: string; message: Message }>,
        ) {
            const { threadId, message } = action.payload;
            state.threads[threadId].messages.push(message);
        },
        appendAssistantChunk(
            state,
            action: PayloadAction<{ threadId: string; content: string }>,
        ) {
            const { threadId, content } = action.payload;
            const thread = state.threads[threadId];
            if (
                thread.messages.length === 0 ||
                thread.messages.slice(-1)[0].sender !== 'assistant'
            ) {
                thread.messages.push({
                    sender: 'assistant',
                    text: content,
                    timestamp: Date.now(),
                });
            } else {
                thread.messages.slice(-1)[0].text += content;
            }
        },
    },
});

export const { setCurrentThread, addThread, addMessage, appendAssistantChunk } =
    chatSlice.actions;

export default chatSlice.reducer;
