import { config } from 'dotenv';
import type { Logger } from 'drizzle-orm/logger';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema'; // Adjust the path as necessary

config({ path: '.env', quiet: true });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(connectionString, {
	prepare: false, // Disable prepared statements as it is not supported for "transaction" pool mode
	max: 10, // Connection pool size
});

class TableNameLogger implements Logger {
	logQuery(query: string): void {
		// Detect operation
		const operationMatch = query
			.trim()
			.match(/^(SELECT|INSERT|UPDATE|DELETE)/i);
		const operation = operationMatch?.[1]?.toUpperCase() || 'UNKNOWN';

		// Extract table names (better regex)
		const tableRegex =
			/(?:FROM|JOIN|INTO|UPDATE|DELETE FROM)\s+"?([a-zA-Z_][a-zA-Z0-9_.]*)"?/gi;

		const matches = [...query.matchAll(tableRegex)];

		const tables = matches
			.map((match) => match[1].split('.').pop()) // remove schema (public.users → users)
			.filter(Boolean);

		const uniqueTables = [...new Set(tables)];

		if (uniqueTables.length > 0) {
			console.warn(`📊 ${operation} → ${uniqueTables.join(', ')}`);
		}
	}
}

const db = drizzle(client, {
	schema,
	logger:
		process.env.NODE_ENV === 'development' ? new TableNameLogger() : false,
});

export default db;
