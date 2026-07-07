import React from "react";
import { Button } from "../ui/button";
import {
  ArrowUpCircle,
  LinkIcon,
  PauseIcon,
  PlayIcon,
  PlusCircle,
  RefreshCw,
  RefreshCwOff,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { GlobalPlayerState } from ".";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { toast } from "sonner";
type Props = {
  showControls: boolean;
  state: GlobalPlayerState;
  sync: boolean;
  updateSync: (sync: boolean) => void;
  updateState: (state: GlobalPlayerState) => void;
  addLink: (link: string) => void;
};

export function ControllerUIBar({
  showControls,
  state,
  sync,
  updateSync,
  updateState,
  addLink,
}: Props) {
  const [url, setUrl] = React.useState<string>("");
  return (
    <div
      className={`absolute bottom-0 left-0 w-full z-20 p-4 transition-opacity duration-300
          ${showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
    >
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
                    console.log(url);
                    if (
                      !url.startsWith("https://youtube.com") &&
                      !url.startsWith("https://youtu.be/")
                    )
                      return toast.error(
                        "Url must start with https://youtube.com",
                      );

                    toast.success("Added new video");

                    addLink(url);
                  }}
                >
                  <ArrowUpCircle />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </PopoverContent>
          <PopoverTrigger asChild>
            <Button size={"icon-lg"}>
              <PlusCircle />
            </Button>
          </PopoverTrigger>
        </Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"secondary"}
              size={"icon-lg"}
              onClick={() => updateSync(!sync)}
            >
              {sync && <RefreshCw className="text-primary" />}
              {!sync && <RefreshCwOff />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{sync ? "in sync" : "out of sync"}</TooltipContent>
        </Tooltip>
        <Button
          onClick={() => updateState({ ...state, playing: !state.playing })}
          disabled={!sync}
          variant={"secondary"}
          size={"icon-lg"}
        >
          {!state.playing && <PlayIcon />}
          {state.playing && <PauseIcon />}
        </Button>
      </div>
    </div>
  );
}
