import {categoriesFeature, categoriesAdapter} from './categories.reducer';

const {selectCategoriesState, selectLoading, selectError} = categoriesFeature;

const {selectAll} = categoriesAdapter.getSelectors(selectCategoriesState);

export const selectAllCategories = selectAll;
export const selectCategoriesLoading = selectLoading;
export const selectCategoriesError = selectError;
