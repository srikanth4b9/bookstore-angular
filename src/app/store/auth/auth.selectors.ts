import {createSelector} from '@ngrx/store';

import {authFeature} from './auth.reducer';

const {selectUser, selectLoading, selectError} = authFeature;

export const selectCurrentUser = selectUser;
export const selectAuthLoading = selectLoading;
export const selectAuthError = selectError;

export const selectIsAuthenticated = createSelector(selectCurrentUser, (user) => user !== null);

export const selectUserAddresses = createSelector(
  selectCurrentUser,
  (user) => user?.addresses ?? [],
);
