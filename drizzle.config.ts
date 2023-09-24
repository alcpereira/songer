import type { Config } from 'drizzle-kit';
import { loadEnvConfig } from '@next/env';

loadEnvConfig('./');

export default {
    schema: './db/schema.ts',
    out: './drizzle',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.POSTGRES_URL_DRIZZLE_STUDIO ?? ''
    }
} satisfies Config;
