import { InjectionToken } from "@angular/core";

export const RBAC_PROVIDER = "ROLE_ACCESS_PROVIDER";
export const FORBIDDEN_ROUTE = new InjectionToken<string>("ForbiddenRoute");