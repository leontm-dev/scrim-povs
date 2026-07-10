import { ControllerUI } from "@/components/controller-ui";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Local session | Scrim POVs",
  description:
    "Hold a vod review locally with a shareable link so that settings are safed for the future.",
  robots: {
    index: true,
    follow: true,
  },
};
export default function SessionsLocalPageClient() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <ControllerUI />
      </Suspense>
    </div>
  );
}
