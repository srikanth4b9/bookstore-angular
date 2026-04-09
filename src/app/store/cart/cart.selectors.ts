import {createSelector} from '@ngrx/store';

import {cartFeature} from './cart.reducer';

const {selectItems} = cartFeature;

export const selectCartItems = selectItems;

export const selectCartSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.bookPrice * item.quantity, 0),
);

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const selectCartBookMap = createSelector(selectCartItems, (items) => {
  const map = new Map<string, {cartItemId: string; quantity: number}>();
  for (const item of items) {
    map.set(item.bookId, {cartItemId: item.id, quantity: item.quantity});
  }
  return map;
});
