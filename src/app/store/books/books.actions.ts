import {createActionGroup, emptyProps, props} from '@ngrx/store';

import {Book, Pagination} from '../../models/models';

export const BooksActions = createActionGroup({
  source: 'Books',
  events: {
    'Load Books': props<{
      page: number;
      limit: number;
      search?: string;
      category?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }>(),
    'Load Books Success': props<{books: Book[]; pagination: Pagination}>(),
    'Load Books Failure': props<{error: string}>(),

    'Load Book': props<{id: string}>(),
    'Load Book Success': props<{book: Book}>(),
    'Load Book Failure': props<{error: string}>(),

    'Add Book': props<{book: Partial<Book>}>(),
    'Add Book Success': props<{book: Book}>(),
    'Add Book Failure': props<{error: string}>(),

    'Update Book': props<{id: string; changes: Partial<Book>}>(),
    'Update Book Success': props<{book: Book}>(),
    'Update Book Failure': props<{error: string}>(),

    'Delete Book': props<{id: string}>(),
    'Delete Book Success': props<{id: string}>(),
    'Delete Book Failure': props<{error: string}>(),

    'Clear Selected Book': emptyProps(),
  },
});
