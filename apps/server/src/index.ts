import { auth } from "@better-auth-elysia-obo-2/auth";
import { env } from "@better-auth-elysia-obo-2/env/server";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const oboTokenExchange = async (accessToken: string) => {
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    client_id: env.ENTRA_CLIENT_ID,
    client_secret: env.ENTRA_CLIENT_SECRET,
    assertion: accessToken,
    scope: env.ENTRA_OBO_SCOPE,
    requested_token_use: "on_behalf_of",
  });

  const response = await fetch(`https://login.microsoftonline.com/${env.ENTRA_TENANT_ID}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  return await response.json();
}

const app = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .mount(auth.handler)
  .get("/", async ({request: { headers }}) => {
    const session = await auth.api.getSession({ headers });
    const { accessToken } = await auth.api.getAccessToken({ body: { providerId: "microsoft" }, headers });

    if (session) {
      // try obo flow:
      const oboToken = await oboTokenExchange(accessToken);
      console.log(oboToken);
    }

    return {
      session
    }
  })
  .listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
