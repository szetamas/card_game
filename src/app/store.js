import { configureStore, MiddlewareArray } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import userReducer from './userSlice';
import deckReducer from './deckSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    deck: deckReducer,
  },
  middleware: new MiddlewareArray().concat(thunk),
});

export const dispatch = store.dispatch;
