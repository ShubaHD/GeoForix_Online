"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "@/components/boreholes-map";

const BoreholesMap = dynamic(
  () =>
    import("@/components/boreholes-map").then((m) => m.BoreholesMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-lg border border-line bg-panel text-sm text-muted">
        Map…
      </div>
    ),
  },
);

export function BoreholesMapClient(
  props: {
    points: MapPoint[];
    pickMode?: boolean;
    onPick?: (lat: number, lng: number) => void;
    height?: string;
  },
) {
  return <BoreholesMap {...props} />;
}
