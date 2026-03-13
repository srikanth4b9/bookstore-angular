import {Component, inject, computed} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MockDataService} from '../../services/mock-data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private mockData = inject(MockDataService);
  user = this.mockData.currentUser;
  cartCount = computed(() =>
    this.mockData.cartItems().reduce((acc, item) => acc + item.quantity, 0),
  );
}
