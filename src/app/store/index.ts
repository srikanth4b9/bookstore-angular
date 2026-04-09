import {ActionReducerMap} from '@ngrx/store';

import {BooksState, booksFeature} from './books/books.reducer';
import {CategoriesState, categoriesFeature} from './categories/categories.reducer';
import {CartState, cartFeature} from './cart/cart.reducer';
import {OrdersState, ordersFeature} from './orders/orders.reducer';
import {AuthState, authFeature} from './auth/auth.reducer';

export interface AppState {
  books: BooksState;
  categories: CategoriesState;
  cart: CartState;
  orders: OrdersState;
  auth: AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  books: booksFeature.reducer,
  categories: categoriesFeature.reducer,
  cart: cartFeature.reducer,
  orders: ordersFeature.reducer,
  auth: authFeature.reducer,
};
