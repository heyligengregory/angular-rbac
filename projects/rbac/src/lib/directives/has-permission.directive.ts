import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Directive({
	selector: '[hasPermission]',
})
export class HasPermissionDirective {
	@Input() set hasPermission(permission: string) {
		if (this.permissionsService.hasPermission(permission)) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainer.clear();
		}
	}

	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private permissionsService: PermissionsService
	) {}
}
