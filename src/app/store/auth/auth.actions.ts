import {createActionGroup, emptyProps, props} from '@ngrx/store';

import {User} from '../../models/models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Set User': props<{user: User}>(),
    'Clear User': emptyProps(),
    Login: props<{email: string; password: string}>(),
    'Login Success': props<{user: User}>(),
    'Login Failure': props<{error: string}>(),
    Register: props<{name: string; email: string; password: string}>(),
    'Register Success': props<{user: User}>(),
    'Register Failure': props<{error: string}>(),
  },
});
