import {createSelector} from '@ngrx/store';

import {ordersFeature, ordersAdapter} from './orders.reducer';

const {
  selectOrdersState,
  selectLoading,
  selectError,
  selectLastPlacedOrderId: selectLastOrderId,
} = ordersFeature;

const {selectAll} = ordersAdapter.getSelectors(selectOrdersState);

export const selectAllOrders = selectAll;
export const selectOrdersLoading = selectLoading;
export const selectOrdersError = selectError;
export const selectLastPlacedOrderId = selectLastOrderId;

export const selectTotalSales = createSelector(selectAllOrders, (orders) =>
  orders.reduce((acc, order) => acc + order.total, 0),
);
