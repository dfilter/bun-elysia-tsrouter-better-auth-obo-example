import { env } from "@better-auth-elysia-obo-2/env/server";
import { drizzle } from "drizzle-orm/bun-sqlite";

import * as schema from "./schema";

export const db = drizzle(env.DATABASE_URL, { schema, casing: "snake_case" });
