import {Router} from '@angular/router';
import {MockBuilder, MockRender} from 'ng-mocks';
import {provideMockStore, MockStore} from '@ngrx/store/testing';

import {CartItem, User, UserRole} from '../../models/models';
import {CheckoutComponent} from './checkout.component';
import {selectCartItems, selectCartSubtotal} from '../../store/cart/cart.selectors';
import {selectOrdersLoading, selectLastPlacedOrderId} from '../../store/orders/orders.selectors';
import {selectCurrentUser} from '../../store/auth/auth.selectors';
import {OrdersActions} from '../../store/orders/orders.actions';

describe('CheckoutComponent', () => {
  const mockCartItems: CartItem[] = [
    {id: 'ci-1', bookId: '1', bookTitle: 'Book 1', bookPrice: 10, quantity: 1, imageUrl: ''},
  ];

  const mockUser: User = {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.USER,
    addresses: [
      {
        id: 'a1',
        street: '123 Main St',
        city: 'Reading',
        state: 'PA',
        zipCode: '19601',
        country: 'USA',
        isDefault: true,
      },
    ],
    orderHistoryIds: [],
    wishlistIds: [],
  };

  let store: MockStore;

  beforeEach(() => {
    return MockBuilder(CheckoutComponent)
      .provide(
        provideMockStore({
          selectors: [
            {selector: selectCartItems, value: mockCartItems},
            {selector: selectCartSubtotal, value: 10},
            {selector: selectOrdersLoading, value: false},
            {selector: selectCurrentUser, value: mockUser},
            {selector: selectLastPlacedOrderId, value: null},
          ],
        }),
      )
      .mock(Router);
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    const fixture = MockRender(CheckoutComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should populate address from user default address', () => {
    const fixture = MockRender(CheckoutComponent);
    const component = fixture.point.componentInstance;

    expect(component.address.street).toBe('123 Main St');
    expect(component.address.city).toBe('Reading');
    expect(component.address.zipCode).toBe('19601');
  });

  it('should have default payment method as Credit Card', () => {
    const fixture = MockRender(CheckoutComponent);
    expect(fixture.point.componentInstance.paymentMethod).toBe('Credit Card');
  });

  it('should validate form requires street, city, and zipCode', () => {
    const fixture = MockRender(CheckoutComponent);
    const component = fixture.point.componentInstance;

    expect(component.isFormValid()).toBeTruthy();

    component.address.street = '';
    expect(component.isFormValid()).toBeFalsy();
  });

  it('should dispatch placeOrder when form is valid', () => {
    const fixture = MockRender(CheckoutComponent);
    const component = fixture.point.componentInstance;
    store = fixture.point.injector.get(MockStore);
    jest.spyOn(store, 'dispatch');

    component.placeOrder();

    expect(store.dispatch).toHaveBeenCalledWith(
      OrdersActions.placeOrder({
        userId: 'u1',
        items: mockCartItems,
        total: 10,
        shippingAddress: component.address,
        paymentMethod: 'Credit Card',
      }),
    );
  });

  it('should not dispatch placeOrder when form is invalid', () => {
    const fixture = MockRender(CheckoutComponent);
    const component = fixture.point.componentInstance;
    store = fixture.point.injector.get(MockStore);
    jest.spyOn(store, 'dispatch');

    component.address.street = '';
    component.placeOrder();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should set orderPlaced when lastPlacedOrderId changes', () => {
    const fixture = MockRender(CheckoutComponent);
    store = fixture.point.injector.get(MockStore);

    store.overrideSelector(selectLastPlacedOrderId, 'ORD-123');
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.point.componentInstance.orderPlaced()).toBe(true);
    expect(fixture.point.componentInstance.lastOrderId()).toBe('ORD-123');
  });
});
