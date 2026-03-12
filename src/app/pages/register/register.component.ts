import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private mockData = inject(MockDataService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';

  register() {
    // In a real app, this would call an auth service
    alert('Account created successfully (Mock)!');
    this.router.navigate(['/login']);
  }
}
