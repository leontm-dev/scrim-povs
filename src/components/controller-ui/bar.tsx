import React from "react";
import { Button } from "../ui/button";
import {
  ArrowUpCircle,
  LayoutPanelLeft,
  LayoutPanelTop,
  LinkIcon,
  PauseIcon,
  PlayIcon,
  PlusCircle,
  RefreshCw,
  RefreshCwOff,
  RotateCw,
  Settings2,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { VideoSettings } from "@/types/settings.types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { YouTubePlayer } from "react-youtube";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
type Props = {
  showControls: boolean;
  isPlaying: boolean;
  updateIsPlaying: (value: boolean) => void;
  isMuted: boolean;
  updateIsMuted: (value: boolean) => void;
  layout: "top" | "left";
  updateLayout: (value: "top" | "left") => void;
  sync: boolean;
  updateSync: (sync: boolean) => void;
  addVideoSlotViaId: (id: string) => void;
  settings: Map<string, VideoSettings>;
  updateSettings: (forEntry: string, settings: VideoSettings) => void;
  playerInstances: React.RefObject<Map<string, YouTubePlayer>>;
};

export function ControllerUIBar(props: Props) {
  const [url, setUrl] = React.useState<string>("");
  return (
    <div className={`absolute bottom-0 left-0 z-20 w-full p-4`}>
      <div className="flex flex-row items-center justify-center gap-0">
        <Popover>
          <PopoverContent>
            <InputGroup>
              <InputGroupAddon align={"inline-start"}>
                <LinkIcon />
              </InputGroupAddon>
              <InputGroupInput
                value={url}
                onChange={(ev) => setUrl(ev.target.value)}
                placeholder="https://youtube.com/..."
              />
              <InputGroupAddon align={"inline-end"}>
                <InputGroupButton
                  size={"icon-sm"}
                  onClick={() => {
                    if (!URL.canParse(url))
                      return toast.error("Couldn't work with this url.");
                    const parsedUrl = new URL(url);

                    const hostname = parsedUrl.hostname
                      .replace("m.", "")
                      .replace("www.", "");

                    if (hostname === "youtube.com") {
                      const videoIdSearchParam =
                        parsedUrl.searchParams.get("v");
                      if (
                        !videoIdSearchParam &&
                        typeof videoIdSearchParam !== "string"
                      ) {
                        if (parsedUrl.pathname.includes("/embed/")) {
                          const embedLinkVideoId =
                            parsedUrl.pathname.split("/")[2];
                          if (!embedLinkVideoId)
                            return toast.error(
                              "We couldn't find the video id in your link"
                            );

                          setUrl("");
                          return props.addVideoSlotViaId(embedLinkVideoId);
                        } else
                          return toast.error(
                            "Please provide a supported video link"
                          );
                      }
                      setUrl("");
                      return props.addVideoSlotViaId(videoIdSearchParam);
                    } else if (hostname === "youtu.be") {
                      const videoIdInPathname = parsedUrl.pathname.replace(
                        "/",
                        ""
                      );
                      if (
                        videoIdInPathname.length === 0 ||
                        videoIdInPathname.includes("/")
                      )
                        return toast.error(
                          "Please provide a support youtube link"
                        );
                      setUrl("");
                      return props.addVideoSlotViaId(videoIdInPathname);
                    } else if (hostname === "youtube-nocookie.com") {
                      const embedVideoId = parsedUrl.pathname.replace(
                        "/embed/",
                        ""
                      );
                      if (
                        embedVideoId.length === 0 ||
                        embedVideoId.includes("/")
                      )
                        return toast.error("Something wrong with your link");

                      setUrl("");
                      return props.addVideoSlotViaId(embedVideoId);
                    } else
                      return toast.error("You need to provide youtube urls");
                  }}
                >
                  <ArrowUpCircle />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </PopoverContent>
          <PopoverTrigger asChild>
            <Button
              size={"icon-lg"}
              disabled={props.playerInstances.current.size === 9}
            >
              <PlusCircle />
            </Button>
          </PopoverTrigger>
        </Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"secondary"}
              size={"icon-lg"}
              onClick={() => props.updateSync(!props.sync)}
            >
              {props.sync && <RefreshCw className="text-primary" />}
              {!props.sync && <RefreshCwOff />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {props.sync ? "in sync" : "out of sync"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipContent>Skip back 10s</TooltipContent>
          <TooltipTrigger asChild>
            <Button
              variant={"secondary"}
              size={"icon-lg"}
              onClick={() => {
                props.playerInstances.current.entries().forEach((e) => {
                  const playerSettings = props.settings.get(e[0]);
                  e[1].getCurrentTime().then((res) => {
                    const newTime = res - 10;
                    if (newTime < (playerSettings?.startAt || 0))
                      e[1].seekTo(playerSettings?.startAt || 0, true);
                    else e[1].seekTo(res - 10, true);
                  });
                });
              }}
            >
              <SkipBack />
            </Button>
          </TooltipTrigger>
        </Tooltip>
        <Button
          onClick={() => {
            props.playerInstances.current.forEach((player) => {
              if (props.isPlaying) player.pauseVideo();
              else player.playVideo();
            });
            props.updateIsPlaying(!props.isPlaying);
          }}
          disabled={!props.sync}
          variant={"secondary"}
          size={"icon-lg"}
        >
          {!props.isPlaying && <PlayIcon />}
          {props.isPlaying && <PauseIcon />}
        </Button>
        <Tooltip>
          <TooltipContent>Skip ahead 10s</TooltipContent>
          <TooltipTrigger asChild>
            <Button
              variant={"secondary"}
              size={"icon-lg"}
              onClick={() => {
                props.playerInstances.current.forEach((e) => {
                  e.getCurrentTime().then((res) => {
                    e.seekTo(res + 10, true);
                  });
                });
              }}
            >
              <SkipForward />
            </Button>
          </TooltipTrigger>
        </Tooltip>
        <Tooltip>
          <TooltipContent>Restart</TooltipContent>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                props.playerInstances.current.entries().forEach((e) => {
                  const playerSettings = props.settings.get(e[0]);

                  e[1].seekTo(playerSettings?.startAt || 0, true);
                });
              }}
              disabled={!props.sync}
              variant={"secondary"}
              size={"icon-lg"}
            >
              <RotateCw />
            </Button>
          </TooltipTrigger>
        </Tooltip>
        <Popover>
          <PopoverContent>
            <div className="flex flex-col gap-2">
              <p>Starting points</p>
            </div>
            {Array.from(props.settings.entries()).map(
              (settingsEntry, index) => (
                <div
                  key={settingsEntry[0]}
                  className="flex flex-row items-center justify-between gap-1"
                >
                  <p className="text-sm text-nowrap">video #{index + 1}</p>
                  <Input
                    type="number"
                    className="w-min"
                    defaultValue={settingsEntry[1].startAt}
                    onChange={(ev) => {
                      const parsedValue = parseInt(ev.target.value);

                      props.updateSettings(settingsEntry[0], {
                        startAt: isNaN(parsedValue) ? 0 : parsedValue,
                      });
                    }}
                  />
                </div>
              )
            )}
          </PopoverContent>
          <PopoverTrigger asChild>
            <Button size={"icon-lg"} variant={"secondary"}>
              <Settings2 />
            </Button>
          </PopoverTrigger>
        </Popover>
        <Popover>
          <PopoverContent>
            <Select
              defaultValue={props.layout}
              onValueChange={(value) =>
                props.updateLayout(value as "top" | "left")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">
                  <LayoutPanelLeft /> Left
                </SelectItem>
                <SelectItem value="top">
                  <LayoutPanelTop />
                  Top
                </SelectItem>
              </SelectContent>
            </Select>
          </PopoverContent>
          <PopoverTrigger asChild>
            <Button variant={"secondary"} size={"icon-lg"}>
              {props.layout === "left" ? (
                <LayoutPanelLeft />
              ) : (
                <LayoutPanelTop />
              )}
            </Button>
          </PopoverTrigger>
        </Popover>

        <Button
          variant={"secondary"}
          size={"icon-lg"}
          disabled={!props.sync}
          onClick={() => {
            props.playerInstances.current.forEach((player) => {
              if (props.isMuted) player.unMute();
              else player.mute();
            });
            props.updateIsMuted(!props.isMuted);
          }}
        >
          {!props.isMuted && <Volume2 />}
          {props.isMuted && <VolumeOff />}
        </Button>
      </div>
    </div>
  );
}
