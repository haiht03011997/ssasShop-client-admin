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
import { ICampaign, defaultValue } from 'app/shared/model/campaign.model';

const initialState: EntityState<ICampaign> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = 'api/admin/discountCampaign';

// Actions

export const getEntities = createAsyncThunk('campaigns/fetch_entity_list', async ({ searchText, page, size, sort, filters }: IQueryParams) => {
  return api.get<ICampaign[]>(apiUrl, {
    params: {
      searchText,
      pageNum: page,
      pageSize: size,
      filters: filters && JSON.stringify(filters),
      sort: sort && sort,
      // cacheBuster: new Date().getTime(),
    },
  });
});

export const getAllEntities = createAsyncThunk('campaigns/fetch_select_box_entity', async () => {
  return api.get<IOption[]>(`${apiUrl}/select-box`);
});

export const getEntity = createAsyncThunk(
  'campaigns/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return api.get<ICampaign>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'campaigns/create_entity',
  async (entity: ICampaign, thunkAPI) => {
    const result = await api.post<ICampaign>(apiUrl, cleanEntity(entity));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'campaigns/update_entity',
  async (entity: ICampaign, thunkAPI) => {
    const result = await api.put<ICampaign>(`${apiUrl}`, cleanEntity(entity));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'campaigns/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await api.delete<ICampaign>(requestUrl);
    return result;
  },
  { serializeError: serializeAxiosError },
);

// slice

export const CampaignSlice = createEntitySlice({
  name: 'campaigns',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
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
      .addMatcher(isFulfilled(getAllEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          options: data,
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity), (state, action) => {
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
      .addMatcher(isPending(createEntity, updateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = CampaignSlice.actions;

// Reducer
export default CampaignSlice.reducer;
