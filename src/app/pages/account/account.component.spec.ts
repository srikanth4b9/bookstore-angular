import {MockBuilder, MockRender} from 'ng-mocks';
import {provideMockStore, MockStore} from '@ngrx/store/testing';

import {User, UserRole, Order, OrderStatus} from '../../models/models';
import {AccountComponent} from './account.component';
import {selectCurrentUser} from '../../store/auth/auth.selectors';
import {selectAllOrders} from '../../store/orders/orders.selectors';

describe('AccountComponent', () => {
  let store: MockStore;

  beforeEach(() => {
    return MockBuilder(AccountComponent).provide(
      provideMockStore({
        selectors: [
          {selector: selectCurrentUser, value: null},
          {selector: selectAllOrders, value: []},
        ],
      }),
    );
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    const fixture = MockRender(AccountComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should expose user signal from store', () => {
    const mockUser: User = {
      id: 'u1',
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.USER,
      addresses: [],
      orderHistoryIds: [],
      wishlistIds: [],
    };

    store = MockRender(AccountComponent).point.injector.get(MockStore);
    store.overrideSelector(selectCurrentUser, mockUser);
    store.refreshState();

    const fixture = MockRender(AccountComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.user()).toEqual(mockUser);
  });

  it('should expose orders signal from store', () => {
    const mockOrders: Order[] = [
      {
        id: 'ORD-1',
        userId: 'u1',
        items: [],
        total: 34.99,
        shippingAddress: {
          id: 'a1',
          street: '123 Main St',
          city: 'Reading',
          state: 'PA',
          zipCode: '19601',
          country: 'USA',
          isDefault: true,
        },
        paymentMethod: 'Credit Card',
        status: OrderStatus.DELIVERED,
        orderDate: new Date('2025-12-01'),
      },
    ];

    store = MockRender(AccountComponent).point.injector.get(MockStore);
    store.overrideSelector(selectAllOrders, mockOrders);
    store.refreshState();

    const fixture = MockRender(AccountComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.orders()).toEqual(mockOrders);
  });
});
