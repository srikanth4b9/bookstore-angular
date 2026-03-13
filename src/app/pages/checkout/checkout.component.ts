import {Component, inject, signal} from '@angular/core';
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
import {MockDataService} from '../../services/mock-data.service';
import {Address} from '../../models/models';

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
  private mockData = inject(MockDataService);
  private router = inject(Router);

  cartItems = this.mockData.cartItems;
  subtotal = this.mockData.cartSubtotal;
  isLoading = this.mockData.isLoading;

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
    const user = this.mockData.currentUser();
    if (user && user.addresses.length > 0) {
      this.address = {...user.addresses[0]};
    }
  }

  isFormValid() {
    return this.address.street && this.address.city && this.address.zipCode;
  }

  async placeOrder() {
    if (this.isFormValid()) {
      try {
        const order = await this.mockData.placeOrder(this.address, this.paymentMethod);
        this.lastOrderId.set(order.id);
        this.orderPlaced.set(true);
      } catch {
        alert('Failed to place order. Please try again.');
      }
    }
  }
}
