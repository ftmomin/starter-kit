import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

// export type SettingValues = Record<
// 	string,
// 	string | number | boolean | null | string[] | number[]
// >;

export const status = pgEnum('status', ['Active', 'InActive', 'Deleted']);

export const orgRoles = pgEnum('orgRole', [
  'admin',
  'owner',
  'gh-reception',
  'rest-reception',
  'accountant',
  'member',
  'hms-super-admin',
  'hms-manager',
  'hms-staff',
]);

export const user = pgTable('user', {
  id: uuid().defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  metadata: text('metadata'),
  userSettings: jsonb('userSettings'),
});

export const session = pgTable(
  'session',
  {
    id: uuid().defaultRandom().primaryKey(),
    expiresAt: timestamp('expires_at', {
      mode: 'date',
    }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: uuid()
      .notNull()
      .references(() => user.id, { onDelete: 'set null' }),
    activeOrganizationId: uuid().references(() => organization.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

export const account = pgTable(
  'account',
  {
    id: uuid().defaultRandom().primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: uuid()
      .notNull()
      .references(() => user.id, { onDelete: 'set null' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', {
      mode: 'date',
    }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
      mode: 'date',
    }),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);

export const verification = pgTable(
  'verification',
  {
    id: uuid().defaultRandom().primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', {
      mode: 'date',
    }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

export const organization = pgTable(
  'organization',
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').unique(),
    logo: text('logo'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    metadata: text('metadata'),
    settings: jsonb('settings'),
  },
  (table) => [uniqueIndex('organization_slug_uidx').on(table.slug)],
);

export const organizationRole = pgTable(
  'organizationRole',
  {
    id: uuid().defaultRandom().primaryKey(),
    organizationId: uuid()
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    permission: text('permission').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(
      () => /* @__PURE__ */ new Date(),
    ),
  },
  (table) => [
    index('organizationRole_organizationId_idx').on(table.organizationId),
    index('organizationRole_role_idx').on(table.role),
  ],
);

export const member = pgTable(
  'member',
  {
    id: uuid().defaultRandom().primaryKey(),
    organizationId: uuid()
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    userId: uuid()
      .notNull()
      .references(() => user.id, { onDelete: 'set null' }),
    role: orgRoles('role').default('member').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [
    index('member_organizationId_idx').on(table.organizationId),
    index('member_userId_idx').on(table.userId),
  ],
);

export const invitation = pgTable(
  'invitation',
  {
    id: uuid().defaultRandom().primaryKey(),
    organizationId: uuid()
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: orgRoles('role').default('member').notNull(),
    status: text('status').default('pending').notNull(),
    expiresAt: timestamp('expires_at', {
      mode: 'date',
    }).notNull(),
    createdAt: timestamp('created_at', {
      mode: 'date',
    })
      .defaultNow()
      .notNull(),

    inviterId: uuid()
      .notNull()
      .references(() => user.id, { onDelete: 'set null' }),
  },
  (table) => [
    index('invitation_organizationId_idx').on(table.organizationId),
    index('invitation_email_idx').on(table.email),
  ],
);

//#region  //*=========== AUTH RELATIONS ===========

export const usersRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  memberships: many(member),
  sentInvites: many(invitation, {
    relationName: 'invitedBy',
  }),
}));

export const organizationsRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invites: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
}));

export const sessionRelation = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  members: many(member),
  invitations: many(invitation),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));

//#endregion  //*======== AUTH RELATIONS ===========
