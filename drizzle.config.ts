import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: process.env.AUTH_TOKEN!,
  },
  tablesFilter: ["oration-test_*"],
} satisfies Config;
