import { cacheLife, cacheTag } from 'next/cache';
import * as schema from '@/db/schema';
import { betterAuth, BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { customSession, organization } from 'better-auth/plugins';

import { TOrgRoles } from '@/types/database.type';

import db from '../db';
import { ac } from '../utils/auth-roles';

export const options = {
  appName: 'HMS',
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      account: schema.account,
      session: schema.session,
      organization: schema.organization,
      member: schema.member,
      invitation: schema.invitation,
      verification: schema.verification,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  rateLimit: {
    window: 10, // time window in seconds
    max: 30, // max requests in the window
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes in seconds
    },
    additionalFields: {
      activeOrganizationId: {
        type: 'string',
        required: false,
        defaultValue: null,
      },
    },
  },
  advanced: {
    cookiePrefix: 'hms',
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
  // CSRF protection enabled by default in Better Auth
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(',')
    : [],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async () => {
      // Implement your email sending logic here,
    },
    onPasswordReset: async () => {
      // Implement your email sending logic here,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async () => {
      // Implement your email sending logic here
    },
  },
  user: {
    additionalFields: {
      metadata: {
        type: 'string',
        required: false,
        defaultValue: null,
      },
      userSettings: {
        type: 'json',
        required: false,
      },
    },
  },
  plugins: [
    organization({
      additionalFields: {
        settings: {
          type: 'json',
          required: false,
        },
      },
      ac,
      dynamicAccessControl: {
        enabled: true,
      },
    }),
  ],
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const organization = await db.query.member.findMany({
            where: (member, { eq }) => eq(member.userId, session.userId),
            orderBy: (member, { desc }) => desc(member.createdAt),
            columns: {
              organizationId: true,
            },
          });

          if (!organization || organization.length === 0) {
            return {
              data: {
                ...session,
                activeOrganizationId: null,
              },
            };
          }

          return {
            data: {
              ...session,
              activeOrganizationId:
                organization && organization.length === 1
                  ? organization[0].organizationId
                  : null,
            },
          };
        },
      },
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      'use cache';
      cacheLife('minutes');
      cacheTag(`member-${session.userId}-roles`);

      if (
        session.activeOrganizationId === null ||
        session.activeOrganizationId === undefined
      ) {
        return {
          user: {
            ...user,
            role: 'member' as const satisfies TOrgRoles,
          },
          session,
        };
      }

      const activeOrg = await db.query.member.findFirst({
        where: (member, { eq, and }) =>
          and(
            eq(member.userId, session.userId),
            eq(member.organizationId, session.activeOrganizationId!),
          ),
        orderBy: (member, { desc }) => desc(member.createdAt),
        columns: {
          role: true,
        },
      });

      if (!activeOrg) {
        return {
          user: {
            ...user,
            role: 'member' as const satisfies TOrgRoles,
          },
          session,
        };
      }

      return {
        user: {
          ...user,
          role: activeOrg.role,
        },
        session,
      };
    }, options),
    nextCookies(),
  ],
});
