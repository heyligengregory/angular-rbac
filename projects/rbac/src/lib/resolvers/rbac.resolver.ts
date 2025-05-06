import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { PermissionsService } from "../services/permissions.service";

export const rbacResolver: ResolveFn<any> = () => {
  const permissionsService = inject(PermissionsService);
  permissionsService.load();
  return permissionsService.rolesLoaded$;
};