export type GlobalPlayerState = {
  playing: boolean;
  muted: boolean;
  playbackSpeed: number;
  showControls: boolean;
};
export type PlayerStats = {
  playedSeconds: number;
  durationInSeconds: number;
  loadedSeconds: number;
};
