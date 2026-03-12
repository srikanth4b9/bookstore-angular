import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
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
