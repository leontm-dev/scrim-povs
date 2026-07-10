"use client";

import { cn } from "cnfast";
import React, { useEffect } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ExternalLink, Minus, MousePointer, Spotlight, X } from "lucide-react";
import { Button } from "../ui/button";

type PlaybackTier = "main" | "balanced" | "side";

interface PlayerWrapperProps {
  id: string;
  videoId: string;
  onRegister: (id: string, instance: YouTubeEvent["target"]) => void;
  onUnregister: (id: string) => void;
  className?: HTMLDivElement["className"];
  removeVideoSlotWithId: (id: string) => void;
  setIntoFullScreen: (id: string | null) => void;
  index: number;
  inFullScreen: string | null;
  playbackTier: PlaybackTier;
}

const YT_OPTS: YouTubeProps["opts"] = {
  height: "100%",
  width: "100%",
  playerVars: {
    enablejsapi: 1,
    disablekb: 1,
    rel: 0,
    modestbranding: 1,
    playsinline: 1,
    iv_load_policy: 3,
    origin: typeof window !== "undefined" ? window.location.origin : undefined,
  },
};

function mapTierToQuality(tier: PlaybackTier): "hd720" | "large" | "small" {
  if (tier === "main") return "hd720";
  if (tier === "balanced") return "large";
  return "small";
}

function setQualitySafe(
  player: YouTubeEvent["target"] | null,
  tier: PlaybackTier
): void {
  if (!player) return;
  const quality = mapTierToQuality(tier);

  try {
    player.setPlaybackQuality?.(quality);
  } catch {
    // YouTube behandelt Quality als Hint; Fehler ignorieren.
  }
}

const ControllerUIPlayerComponent: React.FC<PlayerWrapperProps> = ({
  id,
  videoId,
  onRegister,
  onUnregister,
  playbackTier,
  ...props
}) => {
  const unregisterRef = React.useRef(onUnregister);
  const playerRef = React.useRef<YouTubeEvent["target"] | null>(null);

  useEffect(() => {
    unregisterRef.current = onUnregister;
  }, [onUnregister]);

  useEffect(() => {
    const idToUnregister = id;
    return () => {
      unregisterRef.current(idToUnregister);
    };
  }, [id]);

  useEffect(() => {
    setQualitySafe(playerRef.current, playbackTier);
  }, [playbackTier]);

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            if (props.inFullScreen === id) props.setIntoFullScreen(null);
            else props.setIntoFullScreen(id);
          }}
        >
          {props.inFullScreen !== id ? (
            <>
              <Spotlight />
              Highlight
            </>
          ) : (
            <>
              <X /> Unhighlight
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            window.open(`https://youtube.com/watch?v=${videoId}`, "_blank")
          }
        >
          <ExternalLink /> Open in a new tab
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => props.removeVideoSlotWithId(id)}>
          <Minus className="text-destructive" /> Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
      <div
        className={cn(
          "group relative flex h-full min-h-40 items-center justify-center overflow-hidden",
          props.className
        )}
      >
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              "absolute top-2 right-2 z-200",
              !dropdownOpen && "hidden group-hover:flex"
            )}
            variant={"secondary"}
            size={"icon-lg"}
          >
            <MousePointer />
          </Button>
        </DropdownMenuTrigger>

        <div className="relative h-full w-full">
          <YouTube
            videoId={videoId}
            opts={YT_OPTS}
            className="absolute inset-0 h-full w-full"
            onReady={(event) => {
              playerRef.current = event.target;
              onRegister(id, event.target);
              setQualitySafe(event.target, playbackTier);
            }}
            loading="lazy"
          />
        </div>
      </div>
    </DropdownMenu>
  );
};

export const ControllerUIPlayer = React.memo(
  ControllerUIPlayerComponent,
  (prev, next) => {
    const prevFocused = prev.inFullScreen === prev.id;
    const nextFocused = next.inFullScreen === next.id;

    return (
      prev.id === next.id &&
      prev.videoId === next.videoId &&
      prev.className === next.className &&
      prevFocused === nextFocused &&
      prev.playbackTier === next.playbackTier
    );
  }
);
