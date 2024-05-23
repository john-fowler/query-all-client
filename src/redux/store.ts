import { configureStore } from '@reduxjs/toolkit';
import sqlReducer from './sqlSlice';
import resultsReducer from './resultsSlice';
import catalogReducer from './catalogSlice';
import chatReducer from './chatSlice';

const store = configureStore({
    reducer: {
        sql: sqlReducer,
        results: resultsReducer,
        catalog: catalogReducer,
        chat: chatReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
