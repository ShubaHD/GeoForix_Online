"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";

export type MapPoint = {
  id: string;
  code: string;
  latitude: number;
  longitude: number;
  projectCode?: string;
  highlight?: boolean;
};

function pinIcon(code: string, highlight = false) {
  const safe = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const bg = highlight ? "#1f6b4a" : "#fff";
  const fg = highlight ? "#fff" : "#1a2332";
  const dot = highlight ? "#0d3d2a" : "#1f6b4a";
  return L.divIcon({
    className: "geoforix-bh-marker",
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;pointer-events:none;">
      <div style="background:${bg};color:${fg};border:1px solid #1f6b4a;border-radius:4px;padding:2px 6px;font:600 11px/1.2 system-ui,sans-serif;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.35);">${safe}</div>
      <div style="width:12px;height:12px;border-radius:9999px;background:${dot};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);"></div>
    </div>`,
    iconSize: [90, 34],
    iconAnchor: [45, 34],
    popupAnchor: [0, -28],
  });
}

function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 16);
      return;
    }
    const bounds = L.latLngBounds(
      points.map((p) => [p.latitude, p.longitude] as [number, number]),
    );
    map.fitBounds(bounds.pad(0.25));
  }, [map, points]);
  return null;
}

function ClickCapture({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

type Basemap = "satellite" | "osm";

function Tiles({ basemap }: { basemap: Basemap }) {
  if (basemap === "osm") {
    return (
      <TileLayer
        key="osm"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
    );
  }
  // Esri World Imagery — satellite view without Google API key
  return (
    <TileLayer
      key="sat"
      attribution="Tiles &copy; Esri"
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      maxZoom={19}
    />
  );
}

export function BoreholesMap({
  points,
  pickMode = false,
  onPick,
  height = "420px",
}: {
  points: MapPoint[];
  pickMode?: boolean;
  onPick?: (lat: number, lng: number) => void;
  height?: string;
}) {
  const { t } = useI18n();
  const [basemap, setBasemap] = useState<Basemap>("satellite");
  const center = useMemo<[number, number]>(() => {
    if (points.length > 0) return [points[0].latitude, points[0].longitude];
    return [44.4268, 26.1025]; // București default
  }, [points]);

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-panel px-3 py-2 text-xs">
        <span className="text-muted">
          {pickMode
            ? t((m) => m.map.pickHint)
            : t((m) => m.map.pointsCount, { count: points.length })}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setBasemap("satellite")}
            className={`rounded px-2 py-1 font-medium ${
              basemap === "satellite" ? "bg-accent text-white" : "bg-[#e4e8ec]"
            }`}
          >
            {t((m) => m.map.satellite)}
          </button>
          <button
            type="button"
            onClick={() => setBasemap("osm")}
            className={`rounded px-2 py-1 font-medium ${
              basemap === "osm" ? "bg-accent text-white" : "bg-[#e4e8ec]"
            }`}
          >
            OSM
          </button>
        </div>
      </div>
      <div style={{ height }} className="relative z-0">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <Tiles basemap={basemap} />
          <FitBounds points={points} />
          {pickMode && onPick ? <ClickCapture onPick={onPick} /> : null}
          {points.map((p) => (
            <Marker
              key={p.id}
              position={[p.latitude, p.longitude]}
              icon={pinIcon(p.code, p.highlight)}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{p.code}</div>
                  {p.projectCode ? (
                    <div className="text-xs text-muted">{p.projectCode}</div>
                  ) : null}
                  <div className="mt-1 text-xs">
                    {p.latitude.toFixed(6)}, {p.longitude.toFixed(6)}
                  </div>
                  <a
                    className="mt-1 inline-block text-xs text-accent underline"
                    href={`https://www.google.com/maps?q=${p.latitude},${p.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Google Maps
                  </a>
                  {" · "}
                  <Link
                    href={`/boreholes/${p.id}`}
                    className="text-xs text-accent underline"
                  >
                    {t((m) => m.map.openBorehole)}
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
