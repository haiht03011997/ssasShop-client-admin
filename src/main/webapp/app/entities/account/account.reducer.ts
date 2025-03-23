import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { cleanEntity } from 'app/shared/util/entity-utils';
import {
  IQueryParams,
  createEntitySlice,
  EntityState,
  serializeAxiosError,
  IOption,
} from 'app/shared/reducers/reducer.utils';
import { api } from 'app/config/axios-interceptor';
import { IAccount, defaultValue } from 'app/shared/model/account.model';

const initialState: EntityState<IAccount> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = 'api/admin/users';

// Actions

export const getEntities = createAsyncThunk('accounts/fetch_entity_list', async ({ searchText, page, size, sort, filters }: IQueryParams) => {
  return api.get<IAccount[]>(apiUrl, {
    params: {
      searchText,
      pageNum: page,
      pageSize: size,
      filters: filters && JSON.stringify(filters),
      sort: sort && sort,
      cacheBuster: new Date().getTime(),
    },
  });
});

export const activatedAccount = createAsyncThunk(
  'accounts/active_entity',
  async (record: IAccount) => {
    const requestUrl = `${apiUrl}/activated/account`;
    return api.patch<IAccount>(requestUrl, cleanEntity(record));
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  'accounts/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return api.get<IAccount>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'accounts/create_entity',
  async (entity: IAccount, thunkAPI) => {
    const result = await api.post<IAccount>(apiUrl, cleanEntity(entity));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'accounts/update_entity',
  async (entity: IAccount, thunkAPI) => {
    const result = await api.patch<IAccount>(`${apiUrl}`, cleanEntity(entity));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'accounts/partial_update_entity',
  async (entity: IAccount, thunkAPI) => {
    const result = await api.patch<IAccount>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'accounts/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await api.delete<IAccount>(requestUrl);
    return result;
  },
  { serializeError: serializeAxiosError },
);

// slice

export const AccountSlice = createEntitySlice({
  name: 'accounts',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity, activatedAccount), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity, activatedAccount), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = AccountSlice.actions;

// Reducer
export default AccountSlice.reducer;
