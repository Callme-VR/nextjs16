"use client";

import { type PropsWithChildren } from "react";
import { ConvexReactClient } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";

export function ConvexClientProvider({
    children,
    initialToken,
}: PropsWithChildren<{ initialToken?: string | null }>) {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
    
    if (!convexUrl) {
        throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined. Please check your .env.local file and restart your development server.");
    }
    
    const convex = new ConvexReactClient(convexUrl);
    
    return (
        <ConvexBetterAuthProvider
            client={convex}
            authClient={authClient}
            initialToken={initialToken}
        >
            {children}
        </ConvexBetterAuthProvider>
    );
}