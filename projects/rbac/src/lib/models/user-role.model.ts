import { UserRestriction } from "./user-restriction.model";

export type UserRole = {
	applicationId: string;
	roleName: string;
	restrictions: UserRestriction[];
	permissions: string[];
}
