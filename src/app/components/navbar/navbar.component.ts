import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private mockData = inject(MockDataService);
  user = this.mockData.currentUser;
  cartCount = () => this.mockData.cartItems().reduce((acc, item) => acc + item.quantity, 0);
}
