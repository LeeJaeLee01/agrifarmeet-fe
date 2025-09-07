// src/store/slices/boxSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BoxState {
  selectedBoxId: string | null;
}

const initialState: BoxState = {
  selectedBoxId: null,
};

const boxSlice = createSlice({
  name: 'box',
  initialState,
  reducers: {
    setSelectedBoxId: (state, action: PayloadAction<string>) => {
      state.selectedBoxId = action.payload;
    },
    clearSelectedBoxId: (state) => {
      state.selectedBoxId = null;
    },
  },
});

export const { setSelectedBoxId, clearSelectedBoxId } = boxSlice.actions;
export default boxSlice.reducer;
