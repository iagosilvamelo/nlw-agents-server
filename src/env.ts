import { z } from 'zod';

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().default(3333),
  PG_URL: z.string().url().startsWith('postgresql://'),
  GEMINI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
