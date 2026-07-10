import { Button } from "@/components/ui/button";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scrim POVs",
  description:
    "Watch scrim VODs with ease. Switch between different POVs and highlight specific points in time",
  authors: [{ name: "LeonTM", url: "https://leontm.me" }],
  keywords: [
    "scrims",
    "valorant",
    "cs2",
    "counter strike",
    "vods",
    "vod",
    "youtube",
    "povs",
    "multiple videos",
  ],
};
export default function Home() {
  return (
    <div className="flex min-h-screen max-w-screen flex-col gap-4">
      <main className="flex h-screen w-full flex-col items-center justify-center">
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
        <div className="absolute top-0 left-0 flex w-full flex-row items-center justify-end gap-2 p-4">
          <Link href={"/sessions/local"}>
            <Button variant={"secondary"}>Local session</Button>
          </Link>
          <Link href={"/sessions"}>
            <Button variant={"default"} disabled>
              Start
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-center text-2xl md:text-4xl">
            <span className="text-primary font-bold">Scrim POVs</span> - VODs
            made easy
          </h1>
          <p className="text-muted-foreground">
            Add multiple YouTube videos to a session and watch different POVs
            alongside each other.
          </p>
          <div className="flex flex-row items-center justify-center gap-2">
            <Link href={"/sessions"}>
              <Button>create a session</Button>
            </Link>
          </div>
        </div>
      </main>
      <div className="flex w-full flex-row items-center justify-center">
        <div className="flex w-3/4 flex-row items-center justify-center gap-8 py-8">
          <p className="text-muted-foreground text-xs">
            Made with {"<3"} by{" "}
            <Link
              href={"https://github.com/leontm-dev"}
              target="_blank"
              className="text-primary underline"
            >
              LeonTM
            </Link>
          </p>
          <p className="text-muted-foreground text-xs">
            Source code available on{" "}
            <Link
              href={"https://github.com/leontm-dev/scrim-povs"}
              className="text-primary underline"
            >
              GitHub
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
