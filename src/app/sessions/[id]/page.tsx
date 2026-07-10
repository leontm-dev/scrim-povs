import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default function RemoteSettingsPageClient(
  //   props: PageProps<"/sessions/[id]">
) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
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
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-bold md:text-4xl">
          Currently disabled!
        </h1>
        <p className="text-muted-foreground text-center text-sm">
          Remote sessions are currently in development.
        </p>
      </div>
    </div>
  );
}
