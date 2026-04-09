import {createFeature, createReducer, on} from '@ngrx/store';

import {CartItem} from '../../models/models';
import {CartActions} from './cart.actions';

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartFeature = createFeature({
  name: 'cart',
  reducer: createReducer(
    initialState,
    on(CartActions.addToCart, (state, {book}) => {
      const existing = state.items.find((i) => i.bookId === book.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.bookId === book.id ? {...i, quantity: i.quantity + 1} : i,
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: Math.random().toString(36).substr(2, 9),
            bookId: book.id,
            bookTitle: book.title,
            bookPrice: book.price,
            quantity: 1,
            imageUrl: book.imageUrl,
          },
        ],
      };
    }),

    on(CartActions.removeFromCart, (state, {itemId}) => ({
      ...state,
      items: state.items.filter((i) => i.id !== itemId),
    })),

    on(CartActions.updateQuantity, (state, {itemId, quantity}) => {
      if (quantity <= 0) {
        return {...state, items: state.items.filter((i) => i.id !== itemId)};
      }
      return {
        ...state,
        items: state.items.map((i) => (i.id === itemId ? {...i, quantity} : i)),
      };
    }),

    on(CartActions.clearCart, () => initialState),
  ),
});
