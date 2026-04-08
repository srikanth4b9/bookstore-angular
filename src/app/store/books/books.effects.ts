import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {map, exhaustMap, catchError} from 'rxjs/operators';

import {BooksApiService} from '../../services/books-api.service';
import {BooksActions} from './books.actions';

export const loadBooks = createEffect(
  (actions$ = inject(Actions), booksApi = inject(BooksApiService)) =>
    actions$.pipe(
      ofType(BooksActions.loadBooks),
      exhaustMap((action) =>
        booksApi
          .fetchBooks(
            action.page,
            action.limit,
            action.search,
            action.category,
            action.sortBy,
            action.sortOrder,
          )
          .pipe(
            map((response) =>
              BooksActions.loadBooksSuccess({
                books: response.books,
                pagination: response.pagination,
              }),
            ),
            catchError((error) =>
              of(BooksActions.loadBooksFailure({error: error.message ?? 'Failed to load books'})),
            ),
          ),
      ),
    ),
  {functional: true},
);

export const loadBook = createEffect(
  (actions$ = inject(Actions), booksApi = inject(BooksApiService)) =>
    actions$.pipe(
      ofType(BooksActions.loadBook),
      exhaustMap((action) =>
        booksApi.fetchBookById(action.id).pipe(
          map((book) => BooksActions.loadBookSuccess({book})),
          catchError((error) =>
            of(
              BooksActions.loadBookFailure({
                error: error.message ?? 'Failed to load book details',
              }),
            ),
          ),
        ),
      ),
    ),
  {functional: true},
);

export const addBook = createEffect(
  (actions$ = inject(Actions), booksApi = inject(BooksApiService)) =>
    actions$.pipe(
      ofType(BooksActions.addBook),
      exhaustMap((action) =>
        booksApi.addBook(action.book).pipe(
          map((book) => BooksActions.addBookSuccess({book})),
          catchError((error) =>
            of(BooksActions.addBookFailure({error: error.message ?? 'Failed to add book'})),
          ),
        ),
      ),
    ),
  {functional: true},
);

export const updateBook = createEffect(
  (actions$ = inject(Actions), booksApi = inject(BooksApiService)) =>
    actions$.pipe(
      ofType(BooksActions.updateBook),
      exhaustMap((action) =>
        booksApi.updateBook(action.id, action.changes).pipe(
          map((book) => BooksActions.updateBookSuccess({book})),
          catchError((error) =>
            of(BooksActions.updateBookFailure({error: error.message ?? 'Failed to update book'})),
          ),
        ),
      ),
    ),
  {functional: true},
);

export const deleteBook = createEffect(
  (actions$ = inject(Actions), booksApi = inject(BooksApiService)) =>
    actions$.pipe(
      ofType(BooksActions.deleteBook),
      exhaustMap((action) =>
        booksApi.deleteBook(action.id).pipe(
          map(() => BooksActions.deleteBookSuccess({id: action.id})),
          catchError((error) =>
            of(BooksActions.deleteBookFailure({error: error.message ?? 'Failed to delete book'})),
          ),
        ),
      ),
    ),
  {functional: true},
);
