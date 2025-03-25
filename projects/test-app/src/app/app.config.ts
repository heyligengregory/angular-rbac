import { ApplicationConfig, importProvidersFrom, Injectable } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { RBAC_PROVIDER, RbacModule } from '../../../rbac/src/public-api';


@Injectable(
  {
    providedIn: 'root'
  }
)
export class UsersApiService {
  getRoleAccess() {
    return of([{roles: ['a']}]);
  }
}


export const appConfig: ApplicationConfig = {
  providers: [
    UsersApiService,
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      RbacModule.forRoot({
        rbacDataSource: {
          provide: RBAC_PROVIDER,
          useFactory: RoleAccessFactory,
          deps: [UsersApiService],
        },
        forbiddenRoute: ''
      })
    )
  ]
};

export function RoleAccessFactory(usersApiService: UsersApiService) {
	return usersApiService.getRoleAccess();
}