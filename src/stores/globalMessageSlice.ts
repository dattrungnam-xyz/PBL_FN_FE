import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalMessageState {
  message: string | null;
  severity: "success" | "error" | null;
}

const initialState: GlobalMessageState = {
  message: null,
  severity: null,
};

const globalMessageSlice = createSlice({
  name: "globalMessage",
  initialState: initialState,
  reducers: {
    notify(state, action: PayloadAction<GlobalMessageState>) {
      // redux toolkit will handle immutability
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    clear() {
      return initialState;
    },
  },
});

export const globalMessageActions = globalMessageSlice.actions;

export default globalMessageSlice.reducer;
