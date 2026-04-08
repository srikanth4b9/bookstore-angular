import {createFeature, createReducer, on} from '@ngrx/store';
import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';

import {Book, Pagination} from '../../models/models';
import {BooksActions} from './books.actions';

export interface BooksState extends EntityState<Book> {
  pagination: Pagination;
  selectedBook: Book | null;
  loading: boolean;
  error: string | null;
}

export const booksAdapter: EntityAdapter<Book> = createEntityAdapter<Book>();

const initialState: BooksState = booksAdapter.getInitialState({
  pagination: {total: 0, page: 1, limit: 12, pages: 1},
  selectedBook: null,
  loading: false,
  error: null,
});

export const booksFeature = createFeature({
  name: 'books',
  reducer: createReducer(
    initialState,
    on(BooksActions.loadBooks, (state) => ({...state, loading: true, error: null})),
    on(BooksActions.loadBooksSuccess, (state, {books, pagination}) =>
      booksAdapter.setAll(books, {...state, pagination, loading: false}),
    ),
    on(BooksActions.loadBooksFailure, (state, {error}) => ({
      ...state,
      loading: false,
      error,
    })),

    on(BooksActions.loadBook, (state) => ({...state, loading: true, error: null})),
    on(BooksActions.loadBookSuccess, (state, {book}) => ({
      ...state,
      selectedBook: book,
      loading: false,
    })),
    on(BooksActions.loadBookFailure, (state, {error}) => ({
      ...state,
      loading: false,
      error,
    })),

    on(BooksActions.addBookSuccess, (state, {book}) => booksAdapter.addOne(book, state)),
    on(BooksActions.updateBookSuccess, (state, {book}) => booksAdapter.upsertOne(book, state)),
    on(BooksActions.deleteBookSuccess, (state, {id}) => booksAdapter.removeOne(id, state)),

    on(BooksActions.clearSelectedBook, (state) => ({...state, selectedBook: null})),
  ),
});
