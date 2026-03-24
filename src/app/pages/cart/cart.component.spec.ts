import {signal, computed} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';

import {CartItem} from '../../models/models';
import {MockDataService} from '../../services/mock-data.service';
import {CartComponent} from './cart.component';

describe('CartComponent', () => {
  const mockCartItems: CartItem[] = [
    {id: 'ci-1', bookId: '1', bookTitle: 'Book 1', bookPrice: 10, quantity: 2, imageUrl: ''},
    {id: 'ci-2', bookId: '2', bookTitle: 'Book 2', bookPrice: 20, quantity: 1, imageUrl: ''},
  ];

  let mockSnackBar: {open: jest.Mock};

  beforeEach(() => {
    mockSnackBar = {open: jest.fn()};

    return MockBuilder(CartComponent)
      .mock(MockDataService, {
        cartItems: signal(mockCartItems),
        cartSubtotal: computed(() =>
          mockCartItems.reduce((s, i) => s + i.bookPrice * i.quantity, 0),
        ),
        updateQuantity: jest.fn(),
        removeFromCart: jest.fn(),
      })
      .provide({provide: MatSnackBar, useValue: mockSnackBar});
  });

  it('should create', () => {
    const fixture = MockRender(CartComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should expose cart items and subtotal from MockDataService', () => {
    const fixture = MockRender(CartComponent);
    const component = fixture.point.componentInstance;

    expect(component.cartItems().length).toBe(2);
    expect(component.subtotal()).toBe(40);
  });

  it('should compute finalTotal as subtotal minus discount', () => {
    const fixture = MockRender(CartComponent);
    const component = fixture.point.componentInstance;

    expect(component.finalTotal).toBe(40);

    component.discountAmount.set(5);
    expect(component.finalTotal).toBe(35);
  });

  it('should call updateQuantity on service when quantity >= 1', () => {
    const fixture = MockRender(CartComponent);
    const component = fixture.point.componentInstance;
    const mockDataService = ngMocks.get(MockDataService);

    component.updateQuantity('ci-1', 3);
    expect(mockDataService.updateQuantity).toHaveBeenCalledWith('ci-1', 3);
  });

  it('should not call updateQuantity on service when quantity < 1', () => {
    const fixture = MockRender(CartComponent);
    const component = fixture.point.componentInstance;
    const mockDataService = ngMocks.get(MockDataService);

    component.updateQuantity('ci-1', 0);
    expect(mockDataService.updateQuantity).not.toHaveBeenCalled();
  });

  it('should call removeFromCart on service', () => {
    const fixture = MockRender(CartComponent);
    const component = fixture.point.componentInstance;
    const mockDataService = ngMocks.get(MockDataService);

    component.removeItem('ci-1');
    expect(mockDataService.removeFromCart).toHaveBeenCalledWith('ci-1');
  });

  it('should apply SAVE10 promo code for 10% discount', () => {
    const fixture = MockRender(CartComponent);
    const component = fixture.point.componentInstance;

    component.promoCode.set('save10');
    component.applyPromoCode();

    expect(component.isPromoApplied()).toBe(true);
    expect(component.discountAmount()).toBe(4); // 10% of 40
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Promo code SAVE10 applied! 10% discount added.',
      'Close',
      {duration: 3000},
    );
  });

  it('should apply WELCOME promo code for $5 discount', () => {
    const fixture = MockRender(CartComponent);
    const component = fixture.point.componentInstance;

    component.promoCode.set('WELCOME');
    component.applyPromoCode();

    expect(component.isPromoApplied()).toBe(true);
    expect(component.discountAmount()).toBe(5);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Promo code WELCOME applied! $5 discount added.',
      'Close',
      {duration: 3000},
    );
  });

  it('should show error for invalid promo code', () => {
    const fixture = MockRender(CartComponent);
    const component = fixture.point.componentInstance;

    component.promoCode.set('INVALID');
    component.applyPromoCode();

    expect(component.isPromoApplied()).toBe(false);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Invalid promo code.', 'Close', {
      duration: 3000,
    });
  });

  it('should show error for empty promo code', () => {
    const fixture = MockRender(CartComponent);
    const component = fixture.point.componentInstance;

    component.promoCode.set('');
    component.applyPromoCode();

    expect(mockSnackBar.open).toHaveBeenCalledWith('Please enter a promo code.', 'Close', {
      duration: 3000,
    });
  });

  it('should remove promo code and reset discount', () => {
    const fixture = MockRender(CartComponent);
    const component = fixture.point.componentInstance;

    component.promoCode.set('SAVE10');
    component.applyPromoCode();

    component.removePromoCode();

    expect(component.promoCode()).toBe('');
    expect(component.discountAmount()).toBe(0);
    expect(component.isPromoApplied()).toBe(false);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Promo code removed.', 'Close', {
      duration: 3000,
    });
  });
});
