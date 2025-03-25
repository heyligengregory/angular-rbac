import { Inject, Injectable } from '@angular/core';
import { UserRole } from '../models/user-role.model';
import { Observable, tap } from 'rxjs';
import { RBAC_PROVIDER } from '../constants/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private _roles: UserRole[] = [];

  constructor(
    private httpClient: HttpClient,
    @Inject(RBAC_PROVIDER)
    private rbacProvider: Observable<UserRole[]> | string | null
  ) {}

  load(): Observable<UserRole[]> {
    if (!this.rbacProvider) {
      throw new Error(
        'RBAC provider is not configured. Please provide it using RbacModule.forRoot.'
      );
    }

    if (typeof this.rbacProvider === 'string') {
      return this.httpClient
        .get<UserRole[]>(this.rbacProvider)
        .pipe(tap((response) => this.assignRoles(response)));
    }

    return this.rbacProvider.pipe(tap((response) => this.assignRoles(response)));
  }

  hasRole(roleName: string): boolean {
    return this._roles.some((role) => role.roleName === roleName);
  }

  hasPermission(permission: string): boolean {
    return this._roles.some((role) => role.permissions.includes(permission));
  }

  hasRestriction(restrictionName: string, restrictionValue: string): boolean {
    return this._roles.some((role) =>
      role.restrictions.some(
        (restriction) =>
          restriction.name === restrictionName &&
          restriction.value === restrictionValue
      )
    );
  }

  private assignRoles(response: any) {
    if (response == null) return;

    let roles = response;
    if (typeof response === 'string') {
      roles = JSON.parse(response);
    }

    this._roles = roles;
  }
}
