import { inject } from "@angular/core";
import { PermissionsService } from "../services/permissions.service";
import { CanActivateFn, Router } from "@angular/router";
import { FORBIDDEN_ROUTE } from "../constants/constants";
import { filter, first, map } from "rxjs";

export const authorizationGuard: CanActivateFn = (route, state) => {
	const permissionsService = inject(PermissionsService);
	const router = inject(Router);
	const forbiddenRoute = inject(FORBIDDEN_ROUTE);

	const requiredRole = route.data['role'];
	const requiredPermission = route.data['permission'];
	const restriction = route.data['restriction'];

	return permissionsService.rolesLoaded$.pipe(
		map((loaded) => loaded),
		filter((loaded) => loaded),
		first(),
		map((rolesLoaded) => {
			const hasRequiredRole = requiredRole ? permissionsService.hasRole(requiredRole) : true;
			const hasRequiredPermission = requiredPermission ? permissionsService.hasPermission(requiredPermission) : true;
			const hasRestriction = restriction ? permissionsService.hasRestriction(restriction.name, restriction.value) : false;

			if (hasRequiredRole && hasRequiredPermission && !hasRestriction) {
				return true;
			} 
			
			router.navigate([forbiddenRoute]);
			return false;
		})
	);
};