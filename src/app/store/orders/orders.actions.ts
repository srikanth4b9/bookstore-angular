import {createActionGroup, emptyProps, props} from '@ngrx/store';

import {Order, CartItem, Address} from '../../models/models';

export const OrdersActions = createActionGroup({
  source: 'Orders',
  events: {
    'Load Orders': emptyProps(),
    'Load Orders Success': props<{orders: Order[]}>(),
    'Load Orders Failure': props<{error: string}>(),

    'Place Order': props<{
      userId: string;
      items: CartItem[];
      total: number;
      shippingAddress: Address;
      paymentMethod: string;
    }>(),
    'Place Order Success': props<{order: Order}>(),
    'Place Order Failure': props<{error: string}>(),
  },
});
