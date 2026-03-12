import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private mockData = inject(MockDataService);
  private router = inject(Router);

  email = '';
  password = '';

  login() {
    // In a real app, this would call an auth service
    alert('Logged in successfully (Mock)!');
    this.router.navigate(['/']);
  }
}
