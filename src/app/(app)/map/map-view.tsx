"use client";

import { BoreholesMapClient } from "@/components/boreholes-map-client";
import type { MapPoint } from "@/components/boreholes-map";

export function MapView({ points }: { points: MapPoint[] }) {
  return <BoreholesMapClient points={points} height="70vh" />;
}
