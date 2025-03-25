import { inject } from "@angular/core";
import { PermissionsService } from "../services/permissions.service";
import { CanActivateFn, Router } from "@angular/router";
import { FORBIDDEN_ROUTE } from "../constants/constants";

export const authorizationGuard: CanActivateFn = (route, state) => {
	const permissionsService = inject(PermissionsService);
	const router = inject(Router);
	const forbiddenRoute = inject(FORBIDDEN_ROUTE);

	const requiredRole = route.data['role'];
	const requiredPermission = route.data['permission'];
	const restriction = route.data['restriction'];

	const hasRequiredRole = requiredRole ? permissionsService.hasRole(requiredRole) : true;
	const hasRequiredPermission = requiredPermission ? permissionsService.hasPermission(requiredPermission) : true;
	const hasRestriction = restriction ? permissionsService.hasRestriction(restriction.name, restriction.value) : false;

	if (hasRequiredRole && hasRequiredPermission && !hasRestriction) {
		return true;
	} 
	
	router.navigate([forbiddenRoute]);
	return false;
};