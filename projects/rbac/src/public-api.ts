import { CommonModule } from '@angular/common';
import { NgModule, Provider, ModuleWithProviders } from '@angular/core';

import { HasRestrictionDirective } from './lib/directives/has-restriction.directive';
import { HasPermissionDirective } from './lib/directives/has-permission.directive';
import { PermissionsService } from './lib/services/permissions.service';
import { FORBIDDEN_ROUTE, RBAC_PROVIDER } from './lib/constants/constants';

export { RBAC_PROVIDER, FORBIDDEN_ROUTE } from './lib/constants/constants';
export * from './lib/models/user-role.model';
export * from './lib/models/user-restriction.model';
export * from './lib/guards/authorization.guard';
export * from './lib/directives/has-permission.directive';
export * from './lib/directives/has-restriction.directive';
export * from './lib/services/permissions.service';

export interface RbacConfig {
  rbacDataSource?: Provider;
  forbiddenRoute: string;
}

@NgModule({
  imports: [CommonModule],
  declarations: [HasPermissionDirective, HasRestrictionDirective],
  exports: [HasPermissionDirective, HasRestrictionDirective],
})
export class RbacModule {
  static forRoot(
    config: RbacConfig
  ): ModuleWithProviders<RbacModule> {
    return {
      ngModule: RbacModule,
      providers: [
        PermissionsService,
        config.rbacDataSource || {
          provide: RBAC_PROVIDER,
          useFactory: () => {
            throw new Error(
              'Invalid configuration: no data source specified for fetching user information required for role-based access control (RBAC). Please set `config.rbacDataSource` to provide a valid source.'
            );
          },
        },
        {
          provide: FORBIDDEN_ROUTE,
          useValue: config.forbiddenRoute || '/forbidden',
        },
      ],
    };
  }
}
