"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PresenceState } from "@convex-dev/presence/react";

interface PresenceData {
  image?: string;
  name?: string;
}

interface FacepileProps {
  presenceState: PresenceState[];
}

export default function Facepile({ presenceState }: FacepileProps) {
  return (
    <div className="flex -space-x-3 rtl:space-x-reverse">
      <TooltipProvider>
        {presenceState.map((presence, index) => {
          // Flatten structure if needed or handle various shapes
          // presence might be just data, or { data, ... } depending on the library version
          const data = (presence.data || presence) as PresenceData;

          const image = data.image;
          const name = data.name || "User " + (index + 1);

          // If data is just a string (userId), we can't show much without fetching.
          // Maybe we show a generic avatar.

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 border-2 border-background cursor-pointer hover:z-10 transition-transform hover:scale-110">
                  <AvatarImage src={image} alt="User avatar" />
                  <AvatarFallback className="text-[10px]">
                    {name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}
