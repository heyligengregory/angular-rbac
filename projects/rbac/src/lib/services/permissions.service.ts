import { Inject, Injectable } from '@angular/core';
import { UserRole } from '../models/user-role.model';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { RBAC_PROVIDER } from '../constants/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private _roles: UserRole[] = [];
  private _rolesLoaded$ = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    @Inject(RBAC_PROVIDER)
    private rbacProvider: Observable<UserRole[]> | string | null
  ) {}

  load(): Observable<UserRole[]> {
    if (this._rolesLoaded$.value) {
      return of(this._roles);
    }

    if (!this.rbacProvider) {
      throw new Error(
        'RBAC provider is not configured. Please provide it using RbacModule.forRoot.'
      );
    }

    if (typeof this.rbacProvider === 'string') {
      return this.httpClient.get<UserRole[]>(this.rbacProvider).pipe(
        tap((response) => this.assignRoles(response)),
        catchError((_) => this.catchError(_))
      );
    }

    return this.rbacProvider.pipe(
      tap((response) => this.assignRoles(response)),
      catchError((_) => this.catchError(_))
    );
  }

  get rolesLoaded$(): Observable<boolean> {
    return this._rolesLoaded$.asObservable();
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
    this._rolesLoaded$.next(true);
  }

  private catchError(error: Error) {
    //TODO: Log error on dev mode
    this.assignRoles([]);
    return of([]);
  }
}
