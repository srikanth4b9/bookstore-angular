import {MatSnackBar} from '@angular/material/snack-bar';
import {MockBuilder, MockRender} from 'ng-mocks';
import {provideMockStore, MockStore} from '@ngrx/store/testing';

import {CartItem} from '../../models/models';
import {CartComponent} from './cart.component';
import {selectCartItems, selectCartSubtotal} from '../../store/cart/cart.selectors';
import {CartActions} from '../../store/cart/cart.actions';

describe('CartComponent', () => {
  const mockCartItems: CartItem[] = [
    {id: 'ci-1', bookId: '1', bookTitle: 'Book 1', bookPrice: 10, quantity: 2, imageUrl: ''},
    {id: 'ci-2', bookId: '2', bookTitle: 'Book 2', bookPrice: 20, quantity: 1, imageUrl: ''},
  ];

  let mockSnackBar: {open: jest.Mock};
  let store: MockStore;

  beforeEach(() => {
    mockSnackBar = {open: jest.fn()};

    return MockBuilder(CartComponent)
      .provide(
        provideMockStore({
          selectors: [
            {selector: selectCartItems, value: mockCartItems},
            {selector: selectCartSubtotal, value: 40},
          ],
        }),
      )
      .provide({provide: MatSnackBar, useValue: mockSnackBar});
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    const fixture = MockRender(CartComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should expose cart items and subtotal from store', () => {
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

  it('should dispatch updateQuantity action when quantity >= 1', () => {
    const fixture = MockRender(CartComponent);
    store = fixture.point.injector.get(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.point.componentInstance.updateQuantity('ci-1', 3);
    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.updateQuantity({itemId: 'ci-1', quantity: 3}),
    );
  });

  it('should not dispatch updateQuantity when quantity < 1', () => {
    const fixture = MockRender(CartComponent);
    store = fixture.point.injector.get(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.point.componentInstance.updateQuantity('ci-1', 0);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch removeFromCart action', () => {
    const fixture = MockRender(CartComponent);
    store = fixture.point.injector.get(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.point.componentInstance.removeItem('ci-1');
    expect(store.dispatch).toHaveBeenCalledWith(CartActions.removeFromCart({itemId: 'ci-1'}));
  });

  it('should apply SAVE10 promo code for 10% discount', () => {
    const fixture = MockRender(CartComponent);
    const component = fixture.point.componentInstance;

    component.promoCode.set('save10');
    component.applyPromoCode();

    expect(component.isPromoApplied()).toBe(true);
    expect(component.discountAmount()).toBe(4);
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
