import { configureStore } from '@reduxjs/toolkit';
import sqlReducer from './sqlSlice';

const store = configureStore({
  reducer: {
    sql: sqlReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;