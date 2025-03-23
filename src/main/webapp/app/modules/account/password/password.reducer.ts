import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { api } from 'app/config/axios-interceptor';

const initialState = {
  loading: false,
  errorMessage: null,
  successMessage: null,
  updateSuccess: false,
  updateFailure: false,
  entities: [],
  entity: {},
  updating: false,
  totalItems: 0,
};

export type PasswordState = Readonly<typeof initialState>;

const apiUrl = 'api/okr/account';

interface IPassword {
  currentPassword: string;
  newPassword: string;
}

// Actions

export const savePassword = createAsyncThunk(
  'password/change-password',
  async (password: IPassword, thunkAPI) => {
    return api.post<IPassword>(`${apiUrl}/change-password`, password);
  },
  { serializeError: serializeAxiosError },
);

export const PasswordSlice = createEntitySlice({
  name: 'password',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(savePassword.pending, state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })

      .addCase(savePassword.fulfilled, state => {
        state.loading = false;
        state.updateSuccess = true;
      });
  },
});

export const { reset } = PasswordSlice.actions;

// Reducer
export default PasswordSlice.reducer;
