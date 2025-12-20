import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_SITE_URL! || "https://blogger-xi-rose.vercel.app",
    plugins: [convexClient()],
});