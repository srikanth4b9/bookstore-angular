import {createFeature, createReducer, on} from '@ngrx/store';

import {User, UserRole} from '../../models/models';
import {AuthActions} from './auth.actions';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.USER,
    addresses: [
      {
        id: 'a1',
        street: '123 Main St',
        city: 'Reading',
        state: 'PA',
        zipCode: '19601',
        country: 'USA',
        isDefault: true,
      },
    ],
    orderHistoryIds: [],
    wishlistIds: [],
  },
  loading: false,
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(AuthActions.setUser, (state, {user}) => ({...state, user})),
    on(AuthActions.clearUser, (state) => ({...state, user: null})),
    on(AuthActions.login, (state) => ({...state, loading: true, error: null})),
    on(AuthActions.loginSuccess, (state, {user}) => ({...state, user, loading: false})),
    on(AuthActions.loginFailure, (state, {error}) => ({...state, loading: false, error})),
    on(AuthActions.register, (state) => ({...state, loading: true, error: null})),
    on(AuthActions.registerSuccess, (state, {user}) => ({...state, user, loading: false})),
    on(AuthActions.registerFailure, (state, {error}) => ({...state, loading: false, error})),
  ),
});
