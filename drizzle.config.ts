import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    ssl: {
      rejectUnauthorized: false,
    },
    url: process.env.DATABASE_URL!,
  },
});
