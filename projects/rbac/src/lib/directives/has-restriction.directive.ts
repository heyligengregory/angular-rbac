import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Directive({
	selector: '[hasRestriction]',
})
export class HasRestrictionDirective {
	@Input() set hasRestriction(restriction: { name: string; value: string }) {
		if (restriction && this.permissionsService.hasRestriction(restriction.name, restriction.value)) {
			this.viewContainer.clear();
		} else {
			this.viewContainer.createEmbeddedView(this.templateRef);
		}
	}

	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private permissionsService: PermissionsService
	) {}
}
