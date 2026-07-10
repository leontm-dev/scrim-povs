"use client";
import { cn } from "cnfast";
import React from "react";
import { ControllerUIPlayer } from "./player";
import { ControllerUIBar } from "./bar";
import { useQueryState } from "nuqs";
import { DottedGlowBackground } from "../ui/dotted-glow-background";
import { VideoSlot, type VideoSettings } from "@/types/settings.types";
import { YouTubeEvent } from "react-youtube";

const settingsDefault: VideoSettings = {
  startAt: 0,
};

type LayoutMode = "top" | "left";

const LEFT_FULLSCREEN_POSITIONS: Record<number, string[]> = {
  2: ["col-start-5 row-span-2 row-start-4"],
  3: [
    "col-start-5 row-span-2 row-start-3",
    "col-start-5 row-span-2 row-start-5",
  ],
  4: [
    "col-start-5 row-span-2 row-start-2",
    "col-start-5 row-span-2 row-start-4",
    "col-start-5 row-span-2 row-start-6",
  ],
  5: ["row-span-2", "row-span-2", "row-span-2", "row-span-2"],
  6: [
    "col-start-5 row-span-2 row-start-1",
    "col-start-5 row-span-2 row-start-3",
    "col-start-5 row-span-2 row-start-5",
    "col-start-5 row-span-2 row-start-7",
    "col-start-6 row-span-2 row-start-4",
  ],
  7: [
    "col-start-5 row-span-2 row-start-1",
    "col-start-5 row-span-2 row-start-3",
    "col-start-5 row-span-2 row-start-5",
    "col-start-5 row-span-2 row-start-7",
    "col-start-6 row-span-2 row-start-3",
    "col-start-6 row-span-2 row-start-5",
  ],
  8: [
    "col-start-5 row-span-2 row-start-1",
    "col-start-5 row-span-2 row-start-3",
    "col-start-5 row-span-2 row-start-5",
    "col-start-5 row-span-2 row-start-7",
    "col-start-6 row-span-2 row-start-2",
    "col-start-6 row-span-2 row-start-4",
    "col-start-6 row-span-2 row-start-6",
  ],
  9: [
    "col-start-5 row-span-2 row-start-1",
    "col-start-5 row-span-2 row-start-3",
    "col-start-5 row-span-2 row-start-5",
    "col-start-5 row-span-2 row-start-7",
    "col-start-6 row-span-2 row-start-1",
    "col-start-6 row-span-2 row-start-3",
    "col-start-6 row-span-2 row-start-5",
    "col-start-6 row-span-2 row-start-7",
  ],
};

const TOP_FULLSCREEN_POSITIONS: Record<number, string[]> = {
  2: ["col-span-2 col-start-4 row-start-5"],
  3: [
    "col-span-2 col-start-3 row-start-5",
    "col-span-2 col-start-5 row-start-5",
  ],
  4: [
    "col-span-2 col-start-2 row-start-5",
    "col-span-2 col-start-4 row-start-5",
    "col-span-2 col-start-6 row-start-5",
  ],
  5: ["col-span-2", "col-span-2", "col-span-2", "col-span-2"],
  6: [
    "col-span-2 col-start-1 row-start-5",
    "col-span-2 col-start-3 row-start-5",
    "col-span-2 col-start-5 row-start-5",
    "col-span-2 col-start-7 row-start-5",
    "col-span-2 col-start-4 row-start-6",
  ],
  7: [
    "col-span-2 col-start-1 row-start-5",
    "col-span-2 col-start-3 row-start-5",
    "col-span-2 col-start-5 row-start-5",
    "col-span-2 col-start-7 row-start-5",
    "col-span-2 col-start-3 row-start-6",
    "col-span-2 col-start-5 row-start-6",
  ],
  8: [
    "col-span-2 col-start-1 row-start-5",
    "col-span-2 col-start-3 row-start-5",
    "col-span-2 col-start-5 row-start-5",
    "col-span-2 col-start-7 row-start-5",
    "col-span-2 col-start-2 row-start-6",
    "col-span-2 col-start-4 row-start-6",
    "col-span-2 col-start-6 row-start-6",
  ],
  9: [
    "col-span-2 col-start-1 row-start-5",
    "col-span-2 col-start-3 row-start-5",
    "col-span-2 col-start-5 row-start-5",
    "col-span-2 col-start-7 row-start-5",
    "col-span-2 col-start-1 row-start-6",
    "col-span-2 col-start-3 row-start-6",
    "col-span-2 col-start-5 row-start-6",
    "col-span-2 col-start-7 row-start-6",
  ],
};

function getGridClass(
  totalVideos: number,
  inFullscreen: boolean,
  layout: LayoutMode
) {
  if (inFullscreen) {
    if (layout === "left") {
      return totalVideos < 6
        ? "grid-cols-5 grid-rows-8 items-center"
        : "grid-cols-6 grid-rows-8 items-center";
    }

    return totalVideos < 6
      ? "grid-cols-8 grid-rows-5 justify-center"
      : "grid-cols-8 grid-rows-6 justify-center";
  }

  if (totalVideos === 2) return "my-auto h-min grid-cols-2 grid-rows-1";
  if (totalVideos > 2 && totalVideos < 5) return "grid-cols-2 md:grid-cols-4";
  if (totalVideos > 4 && totalVideos < 10) return "md:grid-cols-6";

  return "";
}

function getNormalOffsetClass(totalVideos: number, sideIndex: number) {
  if (totalVideos === 3 && sideIndex === 2) return "col-start-2";
  if (totalVideos === 5 && sideIndex === 3) return "col-start-2";
  if (totalVideos === 5 && sideIndex === 4) return "col-start-4";
  if (totalVideos === 7 && sideIndex === 6) return "col-start-3";
  if (totalVideos === 8 && sideIndex === 6) return "col-start-2";
  if (totalVideos === 8 && sideIndex === 7) return "col-start-4";
  return "";
}

function getFullscreenSideClass(
  totalVideos: number,
  sideIndex: number,
  layout: LayoutMode
) {
  const positions =
    layout === "left"
      ? LEFT_FULLSCREEN_POSITIONS[totalVideos]
      : TOP_FULLSCREEN_POSITIONS[totalVideos];

  return positions?.[sideIndex] ?? "";
}

export function ControllerUI() {
  const [videos, setVideos] = useQueryState<VideoSlot[]>("videos", {
    defaultValue: [],
    parse: (value) => {
      const idArray = value.split(",").filter(Boolean);

      return idArray.map((id) => ({
        url: `https://youtube.com/embed/${id}?modestbranding=1&rel=0`,
        id,
      }));
    },
    serialize: (value) => value.map((slot) => slot.id).join(","),
  });

  const playerInstances = React.useRef<Map<string, YouTubeEvent["target"]>>(
    new Map()
  );

  const [inFullscreen, setInFullscreen] = React.useState<string | null>(null);
  const [layout, setLayout] = React.useState<LayoutMode>("left");

  const [sync, setSync] = React.useState<boolean>(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);

  const [settingsObject, setSettingsObject] = useQueryState<
    Record<string, VideoSettings>
  >("settings", {
    defaultValue: {},
    parse: (value) => JSON.parse(decodeURIComponent(value)),
    serialize: (value) => encodeURIComponent(JSON.stringify(value)),
  });

  const settings = React.useMemo(() => {
    return new Map(Object.entries(settingsObject || {}));
  }, [settingsObject]);

  const registerPlayer = React.useCallback(
    (id: string, instance: YouTubeEvent["target"]) => {
      playerInstances.current.set(id, instance);

      setSettingsObject((prev) => {
        if (prev[id]) return prev;
        return { ...prev, [id]: settingsDefault };
      });
    },
    [setSettingsObject]
  );

  const handleFullScreenChange = React.useCallback(
    (id: string | null) => {
      if (id === null) {
        playerInstances.current.forEach((player) => {
          if (isMuted) player.mute();
          else player.unMute();
        });
      } else {
        playerInstances.current.forEach((player, playerId) => {
          if (playerId === id) return;
          player.mute();
        });
      }

      setInFullscreen(id);
    },
    [isMuted]
  );

  const unregisterPlayer = React.useCallback(
    (id: string) => {
      playerInstances.current.delete(id);

      setSettingsObject((prev) => {
        if (!prev[id]) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [setSettingsObject]
  );

  const sideIndexById = React.useMemo(() => {
    const map = new Map<string, number>();
    let next = 0;

    for (const video of videos) {
      if (video.id === inFullscreen) continue;
      map.set(video.id, next);
      next += 1;
    }

    return map;
  }, [videos, inFullscreen]);

  const getPlayerClass = React.useCallback(
    (videoId: string) => {
      const total = videos.length;
      const isFullscreenMode = Boolean(inFullscreen);
      const isMain = inFullscreen === videoId;
      const sideIndex = sideIndexById.get(videoId) ?? -1;

      return cn(
        total === 1 && !isFullscreenMode && "h-full",
        total > 2 && !isFullscreenMode && "col-span-2",
        isMain &&
          (layout === "left"
            ? "col-span-4 row-span-8"
            : "col-span-8 row-span-4"),
        !isMain &&
          isFullscreenMode &&
          getFullscreenSideClass(total, sideIndex, layout),
        !isFullscreenMode && getNormalOffsetClass(total, sideIndex)
      );
    },
    [videos.length, inFullscreen, layout, sideIndexById]
  );

  const getPlaybackTier = React.useCallback(
    (videoId: string): "main" | "balanced" | "side" => {
      if (inFullscreen === videoId) return "main";
      if (inFullscreen) return "side";

      if (videos.length >= 7) return "side";
      if (videos.length >= 4) return "balanced";

      return "main";
    },
    [inFullscreen, videos.length]
  );

  const addVideoSlotViaId = React.useCallback(
    (id: string) =>
      setVideos((previousVideos) => {
        if (previousVideos.some((v) => v.id === id)) return previousVideos;

        return [
          ...previousVideos,
          {
            id,
            url: `https://youtube.com/embed/${id}?modestbranding=1&rel=0`,
          },
        ];
      }),
    [setVideos]
  );

  return (
    <div className="h-full w-full">
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20 dark:opacity-100"
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />
      <div className="absolute top-0 left-0 flex h-full max-h-screen w-full flex-col items-center justify-center p-4">
        <div
          id="players"
          className={cn(
            "relative mx-4 grid h-full w-full flex-1 gap-2",
            getGridClass(videos.length, Boolean(inFullscreen), layout)
          )}
        >
          {videos.map((video, index) => (
            <ControllerUIPlayer
              setIntoFullScreen={handleFullScreenChange}
              inFullScreen={inFullscreen}
              videoId={video.id}
              index={index}
              id={video.id}
              key={video.id}
              onRegister={registerPlayer}
              onUnregister={unregisterPlayer}
              className={getPlayerClass(video.id)}
              playbackTier={getPlaybackTier(video.id)}
              removeVideoSlotWithId={(id) =>
                setVideos((prev) => prev.filter((v) => v.id !== id))
              }
            />
          ))}
        </div>
        <ControllerUIBar
          layout={layout}
          updateLayout={setLayout}
          sync={sync}
          updateSync={setSync}
          isPlaying={isPlaying}
          updateIsPlaying={setIsPlaying}
          playerInstances={playerInstances}
          updateSettings={(entry, settings) => {
            setSettingsObject((prev) => {
              const next = { ...prev };
              next[entry] = settings;
              return next;
            });
          }}
          isMuted={isMuted}
          updateIsMuted={setIsMuted}
          showControls
          settings={settings}
          addVideoSlotViaId={addVideoSlotViaId}
        />
      </div>
    </div>
  );
}
