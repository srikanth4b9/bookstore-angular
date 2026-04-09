import {createFeature, createReducer, on} from '@ngrx/store';
import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';

import {Category} from '../../models/models';
import {CategoriesActions} from './categories.actions';

export interface CategoriesState extends EntityState<Category> {
  loading: boolean;
  error: string | null;
}

export const categoriesAdapter: EntityAdapter<Category> = createEntityAdapter<Category>();

const initialState: CategoriesState = categoriesAdapter.getInitialState({
  loading: false,
  error: null,
});

export const categoriesFeature = createFeature({
  name: 'categories',
  reducer: createReducer(
    initialState,
    on(CategoriesActions.loadCategories, (state) => ({...state, loading: true, error: null})),
    on(CategoriesActions.loadCategoriesSuccess, (state, {categories}) =>
      categoriesAdapter.setAll(categories, {...state, loading: false}),
    ),
    on(CategoriesActions.loadCategoriesFailure, (state, {error}) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});
