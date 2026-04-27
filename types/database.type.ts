// Types inferred from Drizzle schema
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import * as schema from '../db/schema';

// Organization role type - extracts the enum values from the database schema

export type TRolesOrg = typeof schema.orgRoles;
export type TOrgRoles = TRolesOrg['enumValues'][number];

// Organization types
export type TOrganization = InferSelectModel<typeof schema.organization>;
export type TNewOrganization = InferInsertModel<typeof schema.organization>;
