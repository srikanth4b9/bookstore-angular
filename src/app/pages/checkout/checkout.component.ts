import {Component, inject, signal, effect} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import {Store} from '@ngrx/store';

import {Address} from '../../models/models';
import {selectCartItems, selectCartSubtotal} from '../../store/cart/cart.selectors';
import {selectOrdersLoading, selectLastPlacedOrderId} from '../../store/orders/orders.selectors';
import {selectCurrentUser} from '../../store/auth/auth.selectors';
import {OrdersActions} from '../../store/orders/orders.actions';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatStepperModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private store = inject(Store);
  private router = inject(Router);

  cartItems = this.store.selectSignal(selectCartItems);
  subtotal = this.store.selectSignal(selectCartSubtotal);
  isLoading = this.store.selectSignal(selectOrdersLoading);

  private user = this.store.selectSignal(selectCurrentUser);
  private lastPlacedOrderIdSignal = this.store.selectSignal(selectLastPlacedOrderId);

  address: Address = {
    id: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  };

  paymentMethod = 'Credit Card';
  orderPlaced = signal(false);
  lastOrderId = signal('');

  constructor() {
    const currentUser = this.user();
    if (currentUser && currentUser.addresses.length > 0) {
      this.address = {...currentUser.addresses[0]};
    }

    effect(() => {
      const orderId = this.lastPlacedOrderIdSignal();
      if (orderId && !this.orderPlaced()) {
        this.lastOrderId.set(orderId);
        this.orderPlaced.set(true);
      }
    });
  }

  isFormValid() {
    return this.address.street && this.address.city && this.address.zipCode;
  }

  placeOrder() {
    if (this.isFormValid()) {
      const currentUser = this.user();
      this.store.dispatch(
        OrdersActions.placeOrder({
          userId: currentUser?.id || 'guest',
          items: [...this.cartItems()],
          total: this.subtotal(),
          shippingAddress: this.address,
          paymentMethod: this.paymentMethod,
        }),
      );
    }
  }
}
