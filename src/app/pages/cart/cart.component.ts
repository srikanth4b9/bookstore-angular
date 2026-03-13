import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private mockData = inject(MockDataService);
  private snackBar = inject(MatSnackBar);

  cartItems = this.mockData.cartItems;
  subtotal = this.mockData.cartSubtotal;

  promoCode = signal('');
  isPromoApplied = signal(false);
  discountAmount = signal(0);

  get finalTotal() {
    return this.subtotal() - this.discountAmount();
  }

  updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;
    this.mockData.updateQuantity(itemId, quantity);
  }

  removeItem(itemId: string) {
    this.mockData.removeFromCart(itemId);
  }

  applyPromoCode() {
    const code = this.promoCode().trim().toUpperCase();
    if (code === 'SAVE10') {
      this.discountAmount.set(this.subtotal() * 0.1);
      this.isPromoApplied.set(true);
      this.snackBar.open('Promo code SAVE10 applied! 10% discount added.', 'Close', { duration: 3000 });
    } else if (code === 'WELCOME') {
      this.discountAmount.set(5);
      this.isPromoApplied.set(true);
      this.snackBar.open('Promo code WELCOME applied! $5 discount added.', 'Close', { duration: 3000 });
    } else if (code === '') {
      this.snackBar.open('Please enter a promo code.', 'Close', { duration: 3000 });
    } else {
      this.snackBar.open('Invalid promo code.', 'Close', { duration: 3000 });
    }
  }

  removePromoCode() {
    this.promoCode.set('');
    this.discountAmount.set(0);
    this.isPromoApplied.set(false);
    this.snackBar.open('Promo code removed.', 'Close', { duration: 3000 });
  }
}
