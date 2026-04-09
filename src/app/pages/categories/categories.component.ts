import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Store} from '@ngrx/store';

import {
  selectAllCategories,
  selectCategoriesLoading,
} from '../../store/categories/categories.selectors';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  private store = inject(Store);

  categories = this.store.selectSignal(selectAllCategories);
  isLoading = this.store.selectSignal(selectCategoriesLoading);
}
