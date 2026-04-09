import {createSelector} from '@ngrx/store';

import {booksFeature, booksAdapter} from './books.reducer';

const {selectBooksState, selectSelectedBook, selectPagination, selectLoading, selectError} =
  booksFeature;

const {selectAll, selectEntities, selectTotal} = booksAdapter.getSelectors(selectBooksState);

export const selectAllBooks = selectAll;
export const selectBookEntities = selectEntities;
export const selectBooksTotal = selectTotal;
export const selectBooksPagination = selectPagination;
export const selectBooksLoading = selectLoading;
export const selectBooksError = selectError;
export const selectSelectedBookDetail = selectSelectedBook;

export const selectBookById = (id: string) =>
  createSelector(selectBookEntities, (entities) => entities[id]);
