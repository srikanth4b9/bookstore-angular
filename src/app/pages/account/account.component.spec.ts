import {signal, WritableSignal} from '@angular/core';
import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';

import {User, UserRole, Order, OrderStatus} from '../../models/models';
import {MockDataService} from '../../services/mock-data.service';
import {AccountComponent} from './account.component';

describe('AccountComponent', () => {
  beforeEach(() => {
    return MockBuilder(AccountComponent).mock(MockDataService, {
      currentUser: signal(null),
      orders: signal([]),
    });
  });

  it('should create', () => {
    const fixture = MockRender(AccountComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should expose user signal from MockDataService', () => {
    const mockUser: User = {
      id: 'u1',
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.USER,
      addresses: [],
      orderHistoryIds: [],
      wishlistIds: [],
    };
    const mockDataService = ngMocks.get(MockDataService);
    (mockDataService.currentUser as WritableSignal<User | null>).set(mockUser);

    const fixture = MockRender(AccountComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.user()).toEqual(mockUser);
  });

  it('should expose orders signal from MockDataService', () => {
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
    const mockDataService = ngMocks.get(MockDataService);
    (mockDataService.orders as WritableSignal<Order[]>).set(mockOrders);

    const fixture = MockRender(AccountComponent);
    fixture.detectChanges();

    expect(fixture.point.componentInstance.orders()).toEqual(mockOrders);
  });
});
