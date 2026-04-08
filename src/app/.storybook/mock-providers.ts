import {provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';

import {reducers} from '../store';
import {BooksState, booksAdapter} from '../store/books/books.reducer';
import {CategoriesState, categoriesAdapter} from '../store/categories/categories.reducer';
import {OrdersState, ordersAdapter} from '../store/orders/orders.reducer';
import {AuthState} from '../store/auth/auth.reducer';
import {CartState} from '../store/cart/cart.reducer';
import {MOCK_BOOKS, MOCK_CATEGORIES, MOCK_USER, MOCK_ORDERS} from './mock-data';
import {Book, CartItem, User} from '../models/models';

export function createMockStoreProviders(overrides?: {
  books?: Book[];
  cartItems?: CartItem[];
  user?: User | null;
  isLoading?: boolean;
}) {
  const books = overrides?.books ?? MOCK_BOOKS;
  const cartItems = overrides?.cartItems ?? [];
  const user = overrides?.user !== undefined ? overrides.user : MOCK_USER;

  const booksState: BooksState = booksAdapter.setAll(books, {
    ...booksAdapter.getInitialState(),
    pagination: {total: books.length, page: 1, limit: 12, pages: 1},
    selectedBook: null,
    loading: false,
    error: null,
  });

  const categoriesState: CategoriesState = categoriesAdapter.setAll(MOCK_CATEGORIES, {
    ...categoriesAdapter.getInitialState(),
    loading: false,
    error: null,
  });

  const ordersState: OrdersState = ordersAdapter.setAll(MOCK_ORDERS, {
    ...ordersAdapter.getInitialState(),
    loading: false,
    error: null,
    lastPlacedOrderId: null,
  });

  const cartState: CartState = {items: cartItems};

  const authState: AuthState = {user, loading: false, error: null};

  return [
    provideStore(reducers, {
      initialState: {
        books: booksState,
        categories: categoriesState,
        orders: ordersState,
        cart: cartState,
        auth: authState,
      },
    }),
    provideEffects(),
  ];
}
