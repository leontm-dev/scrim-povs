"use client";
import React from "react";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { ExternalLink, Maximize, Minus, MousePointer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import ReactPlayer from "react-player";
import { GlobalPlayerState } from ".";

type Props = {
  link: string;
  removeLink: () => void;
  handleFullscreen: (open: boolean) => void;
  updateState: (state: GlobalPlayerState) => void;
  sync: boolean;
  state: GlobalPlayerState;
};

export function ControllerUIPlayer({
  link,
  removeLink,
  handleFullscreen,
  sync,
  updateState,
  state,
}: Props) {
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [playerState, setPlayerState] =
    React.useState<GlobalPlayerState>(state);

  React.useEffect(() => {
    if (sync) {
      return updateState(playerState);
    }
  }, [playerState, sync, updateState]);
  const handleOpen = (open: boolean) => {
    setDialogOpen(open);
    handleFullscreen(open);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpen}>
      <DialogContent className="min-w-full h-full bg-transparent border-none shadow-none outline-0">
        <DialogClose className="absolute" />
      </DialogContent>
      <DropdownMenu>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleOpen(true)}>
            <Maximize /> Maximize
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.open(link, "_blank")}>
            <ExternalLink /> Open
          </DropdownMenuItem>
          <DropdownMenuItem onClick={removeLink}>
            <Minus className="text-destructive" /> Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
        <div className="flex group flex-1 relative flex-col items-center justify-center">
          <DropdownMenuTrigger asChild>
            <Button
              variant={"secondary"}
              size={"icon"}
              className="absolute top-2 right-2 z-20"
            >
              <MousePointer />
            </Button>
          </DropdownMenuTrigger>
          <ReactPlayer
            style={{ aspectRatio: "16/9", width: "100%", height: "auto" }}
            playing={state.playing}
            onPlay={() => setPlayerState((s) => ({ ...s, playing: true }))}
            onPause={() => setPlayerState((s) => ({ ...s, playing: false }))}
            muted={state.muted}
            controls={state.showControls}
            playbackRate={state.playbackSpeed}
            src={link}
          />
        </div>
      </DropdownMenu>
    </Dialog>
  );
}
