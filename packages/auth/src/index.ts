import { db } from "@better-auth-elysia-obo-2/db";
import * as schema from "@better-auth-elysia-obo-2/db/schema/auth";
import { env } from "@better-auth-elysia-obo-2/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  socialProviders: {
    microsoft: {
      clientId: env.ENTRA_CLIENT_ID, 
      clientSecret: env.ENTRA_CLIENT_SECRET, 
      tenantId: env.ENTRA_TENANT_ID, 
      authority: "https://login.microsoftonline.com", // Authentication authority URL
      prompt: "consent",
      scope: env.ENTRA_SCOPES,
      disableDefaultScope: true,
    }
  },
  emailAndPassword: {
    enabled: false,
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [],
});
