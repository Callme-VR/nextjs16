"use client";

import { api } from "@/convex/_generated/api";
import { FunctionReference } from "convex/server";
import usePresence from "@convex-dev/presence/react";
import { Id } from "@/convex/_generated/dataModel";
import Facepile from "./Facepile";

interface iAppProps {
    roomId: Id<"posts">,
    userId: string
}

export default function PostPresence({ roomId, userId }: iAppProps) {
    const presenceState = usePresence(api.presence, roomId, userId)

    if (!presenceState || presenceState.length === 0) {
        return null;
    }
    return (
        <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Viewing Now
            </p>
            <div>
                <Facepile presenceState={presenceState}/>
            </div>

        </div>
    )
}
