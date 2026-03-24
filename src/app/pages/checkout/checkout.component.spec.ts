import {CheckoutComponent} from './checkout.component';
import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';
import {MockDataService} from '../../services/mock-data.service';
import {Router} from '@angular/router';
import {signal, computed} from '@angular/core';
import {CartItem, User, UserRole, Order, OrderStatus} from '../../models/models';

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

  beforeEach(() => {
    return MockBuilder(CheckoutComponent)
      .mock(MockDataService, {
        cartItems: signal(mockCartItems),
        cartSubtotal: computed(() =>
          mockCartItems.reduce((s, i) => s + i.bookPrice * i.quantity, 0),
        ),
        isLoading: signal(false),
        currentUser: signal(mockUser),
        placeOrder: jest.fn().mockResolvedValue({
          id: 'ORD-123',
          userId: 'u1',
          items: mockCartItems,
          total: 10,
          shippingAddress: mockUser.addresses[0],
          paymentMethod: 'Credit Card',
          status: OrderStatus.PENDING,
          orderDate: new Date(),
        } as Order),
      })
      .mock(Router);
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

  it('should place order when form is valid', async () => {
    const fixture = MockRender(CheckoutComponent);
    const component = fixture.point.componentInstance;
    const mockDataService = ngMocks.get(MockDataService);

    await component.placeOrder();

    expect(mockDataService.placeOrder).toHaveBeenCalledWith(component.address, 'Credit Card');
    expect(component.orderPlaced()).toBe(true);
    expect(component.lastOrderId()).toBe('ORD-123');
  });

  it('should not place order when form is invalid', async () => {
    const fixture = MockRender(CheckoutComponent);
    const component = fixture.point.componentInstance;
    const mockDataService = ngMocks.get(MockDataService);

    component.address.street = '';
    await component.placeOrder();

    expect(mockDataService.placeOrder).not.toHaveBeenCalled();
    expect(component.orderPlaced()).toBe(false);
  });

  it('should handle order placement failure', async () => {
    const fixture = MockRender(CheckoutComponent);
    const component = fixture.point.componentInstance;
    const mockDataService = ngMocks.get(MockDataService);
    (mockDataService.placeOrder as jest.Mock).mockRejectedValue(new Error('Server error'));
    window.alert = jest.fn();

    await component.placeOrder();

    expect(window.alert).toHaveBeenCalledWith('Failed to place order. Please try again.');
    expect(component.orderPlaced()).toBe(false);
  });
});
