import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { api } from 'app/config/axios-interceptor';
import { AppThunk } from 'app/config/store';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { serializeAxiosError } from './reducer.utils';
import dayjs from 'dayjs';

const AUTH_TOKEN_KEY = 'authentication-token';

export const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  sessionHasBeenFetched: false,
  errorMessage: null as unknown as string, // Errors returned from server side
  redirectMessage: null as unknown as string,
  account: {} as any,
  logoutUrl: null as unknown as string,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Actions
interface IAuthParams {
  userName: string;
  password: string;
  rememberMe?: boolean;
}

export const authenticate = createAsyncThunk(
  'authentication/authenticate',
  // eslint-disable-next-line @typescript-eslint/require-await
  async (auth: IAuthParams) => api.post<any>('api/authenticate', auth),
  {
    serializeError: serializeAxiosError,
  },
);

export const auth: (userName: string, password: string, rememberMe?: boolean) => AppThunk =
  (userName, password, rememberMe = false) =>
    async dispatch => {
      const result = await dispatch(authenticate({ userName, password, rememberMe }));
      const response = result.payload as AxiosResponse;
      const bearerToken = response?.headers?.authorization;
      if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        const jwtToken = bearerToken.slice(7, bearerToken.length);
        if (jwtToken) {
          const tokenDecoded: any = jwtDecode(jwtToken);
          const account = {
            name: tokenDecoded.sub,
          };
          dispatch(storeAccount(account));
          setTokenInCookies(jwtToken, tokenDecoded.exp);
        }
      }
    };

const setTokenInCookies = (token, expiration) => {
  const expires = dayjs.unix(expiration);
  Cookies.set(AUTH_TOKEN_KEY, token, {
    expires: expires.toDate(), // Calculate difference in days
    secure: true,
    sameSite: 'strict',
  });
};

export const clearAuthToken = () => {
  if (Cookies.get(AUTH_TOKEN_KEY)) {
    Cookies.remove(AUTH_TOKEN_KEY);
  }
};

export const logout: () => AppThunk = () => dispatch => {
  dispatch(clearAuth());
  clearAuthToken();
  dispatch(logoutSession());
};

export const clearAuthentication = messageKey => dispatch => {
  clearAuthToken();
  dispatch(authError(messageKey));
};

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState: initialState as AuthenticationState,
  reducers: {
    logoutSession() {
      return {
        ...initialState,
        showModalLogin: true,
      };
    },
    authError(state, action) {
      return {
        ...state,
        showModalLogin: true,
        redirectMessage: action.payload,
      };
    },
    clearAuth(state) {
      return {
        ...state,
        loading: false,
        sessionHasBeenFetched: true,
        isAuthenticated: false,
      };
    },
    authorized(state) {
      return {
        ...state,
        loading: false,
        sessionHasBeenFetched: true,
        isAuthenticated: true,
      };
    },
    storeAccount(state, action) {
      return {
        ...state,
        account: {
          userName: action.payload.name,
          isAdmin: action.payload.isAdmin,
        },
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(authenticate.rejected, (state, action) => ({
        ...initialState,
        errorMessage: action.error.message,
        showModalLogin: true,
        loginError: true,
      }))
      .addCase(authenticate.fulfilled, state => ({
        ...state,
        loading: false,
        loginError: false,
        isAuthenticated: true,
        showModalLogin: false,
        sessionHasBeenFetched: true,
        loginSuccess: true,
      }))
      .addCase(authenticate.pending, state => {
        state.loading = true;
      });
  },
});

export const { logoutSession, authError, clearAuth, authorized, storeAccount } = AuthenticationSlice.actions;

// Reducer
export default AuthenticationSlice.reducer;
