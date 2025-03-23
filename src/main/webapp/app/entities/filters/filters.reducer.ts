// filterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    resetFilter(state) {
      return initialState;
    },
  },
});

export const { resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
