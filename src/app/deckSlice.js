import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
  id: null,
  name: 'defaltDeck',
  cards: [],
};

const deckSlice = createSlice({
  name: 'deck',
  initialState: defaultState,
  reducers: {},
});

export default deckSlice.reducer;
