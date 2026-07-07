"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { ControllerUIPlayer } from "./player";
import { ControllerUIBar } from "./bar";
import { useQueryState } from "nuqs";
import { DottedGlowBackground } from "../ui/dotted-glow-background";

export type GlobalPlayerState = {
  playing: boolean;
  muted: boolean;
  playbackSpeed: number;
  showControls: boolean;
};
export function ControllerUI() {
  const [sync, setSync] = React.useState<boolean>(true);
  const [showControls, setShowControls] = React.useState(true);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [urls, setUrls] = useQueryState<string[]>("urls", {
    defaultValue: [],
    parse: (value) => {
      const rawUrls = value.split(",");

      return rawUrls
        .map((ru) => decodeURIComponent(ru))
        .filter((u) => URL.canParse(u));
    },
    serialize: (value) => value.map((v) => encodeURIComponent(v)).join(","),
  });
  const [full, setFull] = React.useState<boolean>(false);
  const handleMouseMove = () => {
    setShowControls(true);
    if (!full) return;

    // 2. Alten Timer löschen, falls die Maus sich weiter bewegt
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // 3. Neuen Timer starten: Nach 2 Sekunden Stillstand ausblenden
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000); // 2000ms = 2 Sekunden
  };

  const handleMouseLeave = () => {
    if (!full) return;
    // Wenn die Maus den Player komplett verlässt, sofort ausblenden
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowControls(false);
  };
  const [state, setState] = React.useState<GlobalPlayerState>({
    muted: true,
    playbackSpeed: 1,
    playing: false,
    showControls: false,
  });

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
      <div
        className="p-4 w-full flex h-full group absolute top-0 left-0"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          id="players"
          className={cn(
            "h-full relative mx-4 w-full  gap-2 grid-cols-1",
            urls.length <= 2 &&
              "flex md:flex-row flex-col md:items-center md:justify-center",
            urls.length > 2 &&
              urls.length < 5 &&
              "grid md:grid-cols-2 bg-amber-300",
            urls.length > 4 &&
              urls.length < 9 &&
              "grid md:grid-cols-3 bg-green-50",
          )}
        >
          {urls.map((player, index) => (
            <ControllerUIPlayer
              removeLink={() => setUrls((u) => u.filter((e) => e !== player))}
              handleFullscreen={setFull}
              link={player}
              key={player + index}
              sync={sync}
              state={state}
              updateState={(s) => {
                console.log(player, s);
                setState(s);
              }}
            />
          ))}
        </div>
        <ControllerUIBar
          sync={sync}
          updateSync={setSync}
          state={state}
          showControls={showControls}
          updateState={setState}
          addLink={(link) => setUrls((s) => Array.from(new Set([...s, link])))}
        />
      </div>
    </div>
  );
}
