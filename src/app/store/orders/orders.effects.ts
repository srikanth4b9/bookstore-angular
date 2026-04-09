import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {map, exhaustMap, catchError} from 'rxjs/operators';

import {OrdersApiService} from '../../services/orders-api.service';
import {OrdersActions} from './orders.actions';
import {CartActions} from '../cart/cart.actions';

export const loadOrders = createEffect(
  (actions$ = inject(Actions), ordersApi = inject(OrdersApiService)) =>
    actions$.pipe(
      ofType(OrdersActions.loadOrders),
      exhaustMap(() =>
        ordersApi.fetchOrders().pipe(
          map((orders) => OrdersActions.loadOrdersSuccess({orders})),
          catchError((error) =>
            of(
              OrdersActions.loadOrdersFailure({
                error: error.message ?? 'Failed to load orders',
              }),
            ),
          ),
        ),
      ),
    ),
  {functional: true},
);

export const placeOrder = createEffect(
  (actions$ = inject(Actions), ordersApi = inject(OrdersApiService)) =>
    actions$.pipe(
      ofType(OrdersActions.placeOrder),
      exhaustMap((action) =>
        ordersApi
          .placeOrder({
            userId: action.userId,
            items: action.items,
            total: action.total,
            shippingAddress: action.shippingAddress,
            paymentMethod: action.paymentMethod,
          })
          .pipe(
            map((order) => OrdersActions.placeOrderSuccess({order})),
            catchError((error) =>
              of(
                OrdersActions.placeOrderFailure({
                  error: error.message ?? 'Failed to place order',
                }),
              ),
            ),
          ),
      ),
    ),
  {functional: true},
);

export const clearCartOnOrderSuccess = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(OrdersActions.placeOrderSuccess),
      map(() => CartActions.clearCart()),
    ),
  {functional: true},
);
