import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    ENTRA_CLIENT_ID: z.string(),
    ENTRA_TENANT_ID: z.string(),
    ENTRA_CLIENT_SECRET: z.string(),
    ENTRA_REDIRECT_URI: z.string(),
    ENTRA_SCOPES: z.preprocess(v => typeof v === "string" ? v.split(",") : v, z.string().array()),
    ENTRA_OBO_SCOPE: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
