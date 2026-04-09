import {createActionGroup, emptyProps, props} from '@ngrx/store';

import {Book} from '../../models/models';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Add To Cart': props<{book: Book}>(),
    'Remove From Cart': props<{itemId: string}>(),
    'Update Quantity': props<{itemId: string; quantity: number}>(),
    'Clear Cart': emptyProps(),
  },
});
