import {createFeature, createReducer, on} from '@ngrx/store';
import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';

import {Order} from '../../models/models';
import {OrdersActions} from './orders.actions';

export interface OrdersState extends EntityState<Order> {
  loading: boolean;
  error: string | null;
  lastPlacedOrderId: string | null;
}

export const ordersAdapter: EntityAdapter<Order> = createEntityAdapter<Order>();

const initialState: OrdersState = ordersAdapter.getInitialState({
  loading: false,
  error: null,
  lastPlacedOrderId: null,
});

export const ordersFeature = createFeature({
  name: 'orders',
  reducer: createReducer(
    initialState,
    on(OrdersActions.loadOrders, (state) => ({...state, loading: true, error: null})),
    on(OrdersActions.loadOrdersSuccess, (state, {orders}) =>
      ordersAdapter.setAll(orders, {...state, loading: false}),
    ),
    on(OrdersActions.loadOrdersFailure, (state, {error}) => ({
      ...state,
      loading: false,
      error,
    })),

    on(OrdersActions.placeOrder, (state) => ({...state, loading: true, error: null})),
    on(OrdersActions.placeOrderSuccess, (state, {order}) =>
      ordersAdapter.addOne(order, {...state, loading: false, lastPlacedOrderId: order.id}),
    ),
    on(OrdersActions.placeOrderFailure, (state, {error}) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});
