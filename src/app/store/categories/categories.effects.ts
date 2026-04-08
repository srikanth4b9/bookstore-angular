import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {map, exhaustMap, catchError} from 'rxjs/operators';

import {CategoriesApiService} from '../../services/categories-api.service';
import {CategoriesActions} from './categories.actions';

export const loadCategories = createEffect(
  (actions$ = inject(Actions), categoriesApi = inject(CategoriesApiService)) =>
    actions$.pipe(
      ofType(CategoriesActions.loadCategories),
      exhaustMap(() =>
        categoriesApi.fetchCategories().pipe(
          map((categories) => CategoriesActions.loadCategoriesSuccess({categories})),
          catchError((error) =>
            of(
              CategoriesActions.loadCategoriesFailure({
                error: error.message ?? 'Failed to load categories',
              }),
            ),
          ),
        ),
      ),
    ),
  {functional: true},
);
