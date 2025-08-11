import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: { isLoading: true, hasError: false, data: null },
  groups: { isLoading: false, hasError: false, data: null },
  userGroups: { isLoading: false, hasError: false, data: null },
};

export const storeSlice = createSlice({
  initialState,
  name: "store",
  reducers: {
    updateDataFromStore: (state, { payload }) => {
      const { selector, data } = payload || {};
      if (!state[selector]) return;

      if (!state[selector].data) state[selector].data = {};
      state[selector].data = { ...state[selector].data, ...data };
    },

    clearDataFromStore: (state, { payload }) => {
      const { selector } = payload || {};
      if (!state[selector]) return;
      state[selector].data = initialState[selector].data;
    },

    updateLoadingFromStore: (state, { payload }) => {
      const { selector, value } = payload || {};
      if (!state[selector]) return;

      state[selector].isLoading = value;
    },

    updateErrorFromStore: (state, { payload }) => {
      const { selector, value } = payload || {};
      if (!state[selector]) return;

      state[selector].hasError = value;
    },
  },
});

// Export action creators
export const {
  clearDataFromStore,
  updateDataFromStore,
  updateErrorFromStore,
  updateLoadingFromStore,
} = storeSlice.actions;

// Export reducer as default
export default storeSlice.reducer;
