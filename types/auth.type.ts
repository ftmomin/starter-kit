import type { auth } from '@/lib/auth';

export type TSession = typeof auth.$Infer.Session;
export type TOnlySession = typeof auth.$Infer.Session.session;

export type TUser = typeof auth.$Infer.Session.user;
