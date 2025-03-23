import axios from 'axios';
import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { api } from 'app/config/axios-interceptor';

const initialState = {
  loading: false,
  resetPasswordSuccess: false,
  resetPasswordFailure: false,
};

export type PasswordResetState = Readonly<typeof initialState>;

const apiUrl = 'api/okr/account/reset-password';
// Actions

export const resetPassword = createAsyncThunk(
  'passwordReset/reset_password',
  // If the content-type isn't set that way, axios will try to encode the body and thus modify the data sent to the server.
  async (payload: any) => api.post(`${apiUrl}-init`, payload),
  { serializeError: serializeAxiosError },
);

export const resetPasswordFinish = createAsyncThunk(
  'passwordReset/reset_password_finish',
  async (data: { token: string; newPassword: string }) =>
    api.put(
      `${apiUrl}-finish`,
      { newPassword: data.newPassword },
      {
        headers: {
          Authorization: 'Bearer ' + data.token,
        },
      },
    ),
  { serializeError: serializeAxiosError },
);

export const PasswordResetSlice = createSlice({
  name: 'passwordReset',
  initialState: initialState as PasswordResetState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(resetPassword.fulfilled, () => ({
        ...initialState,
        loading: false,
        resetPasswordSuccess: true,
      }))
      .addCase(resetPasswordFinish.fulfilled, () => ({
        ...initialState,
        loading: false,
        resetPasswordSuccess: true,
      }))
      .addMatcher(isPending(resetPassword, resetPasswordFinish), state => {
        state.loading = true;
      })
      .addMatcher(isRejected(resetPassword, resetPasswordFinish), () => ({
        ...initialState,
        loading: false,
        resetPasswordFailure: true,
      }));
  },
});

export const { reset } = PasswordResetSlice.actions;

// Reducer
export default PasswordResetSlice.reducer;
