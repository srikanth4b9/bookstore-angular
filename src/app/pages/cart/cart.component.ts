import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private mockData = inject(MockDataService);
  cartItems = this.mockData.cartItems;
  subtotal = this.mockData.cartSubtotal;

  updateQuantity(itemId: string, quantity: number) {
    this.mockData.updateQuantity(itemId, quantity);
  }

  removeItem(itemId: string) {
    this.mockData.removeFromCart(itemId);
  }
}
