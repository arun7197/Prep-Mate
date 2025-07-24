import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_8BrAeRm5Nyqv@ep-rapid-credit-a8e3zhjr-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require',
  },
});
