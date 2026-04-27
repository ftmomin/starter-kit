import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements } from 'better-auth/plugins/organization/access';

const statement = {
  ...defaultStatements,
  project: ['create', 'share', 'update', 'delete'],
  organization: ['update', 'delete'],
} as const;

const ac = createAccessControl(statement);

export { ac, statement };
