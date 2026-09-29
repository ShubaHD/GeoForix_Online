"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";
import {
  BOREHOLE_CATEGORIES,
  COLOR_OPTIONS,
  CONSISTENCY_OPTIONS,
  EQUIPMENT_TYPES,
  SAMPLE_TYPES,
  SAND_COMPACTION_OPTIONS,
  SOIL_TYPES,
  labelField,
  usesSandCompaction,
} from "@/lib/field-options";
import {
  collectBoreholeWarnings,
  fillWarningTemplate,
} from "@/lib/borehole-warnings";
import { InsituPanels } from "./insitu-panels";
import { BoreholesMapClient } from "@/components/boreholes-map-client";
import type { MapPoint } from "@/components/boreholes-map";

type Layer = {
  id: string;
  fromM: number;
  toM: number;
  type: string | null;
  consistency: string | null;
  sandCompaction: string | null;
  color: string | null;
  notes: string | null;
};

type Sample = {
  id: string;
  depthM: string;
  type: string;
  sptValues: string | null;
  notes: string | null;
};

type Water = {
  id: string;
  duringM: number | null;
  after24hM: number | null;
  notes: string | null;
  date: string;
};

type Equip = { id: string; type: string; fromM: number; toM: number };
type Photo = {
  id: string;
  name: string;
  filePath: string;
  depthM: number | null;
};

type Initial = {
  id: string;
  code: string;
  depthMeters: number | null;
  latitude: number | null;
  longitude: number | null;
  kilometraj: string | null;
  tipInstalatie: string | null;
  intocmit: string | null;
  categorie: string | null;
  notes: string | null;
  drilledAt: string | null;
  layers: Layer[];
  samples: Sample[];
  waterLevels: Water[];
  equipment: Equip[];
  photos: Photo[];
  pmtReadings: {
    id: string;
    presiometerType: string;
    depthFromM: number;
    depthToM: number;
    testDate: string;
    notes: string | null;
  }[];
  otvReadings: {
    id: string;
    testKind: string;
    depthFromM: number;
    depthToM: number;
    testDate: string;
    notes: string | null;
  }[];
  ppReadings: {
    id: string;
    plunger: string;
    depthFrom: number;
    depthTo: number;
    valuesCsv: string;
  }[];
  vstReadings: {
    id: string;
    vaneSize: string;
    depthFrom: number;
    depthTo: number;
    valueKgCm2: number;
  }[];
  rqdReadings: {
    id: string;
    depthFrom: number;
    depthTo: number;
    rqdPercent: number;
    tcrPercent: number;
    scrPercent: number;
    scrRule: string | null;
  }[];
  mapPoints: MapPoint[];
};

const inputCls =
  "mt-1 block w-full rounded border border-line bg-panel px-2 py-1.5 text-sm";
const btnPrimary =
  "rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90";
const btnGhost =
  "rounded border border-line px-3 py-1.5 text-sm hover:bg-bg";

export function BoreholeEditor({
  initial,
  uiLocale,
}: {
  initial: Initial;
  uiLocale: Locale;
}) {
  const { t, locale, messages } = useI18n();
  const router = useRouter();
  const [tab, setTab] = useState<string>("data");
  const [msg, setMsg] = useState("");
  const [pdfLang, setPdfLang] = useState<Locale>(uiLocale);
  const [soilType, setSoilType] = useState<string>(SOIL_TYPES[0]);
  const [lat, setLat] = useState<string>(
    initial.latitude != null ? String(initial.latitude) : "",
  );
  const [lng, setLng] = useState<string>(
    initial.longitude != null ? String(initial.longitude) : "",
  );
  const [editMapLocation, setEditMapLocation] = useState(false);
  const sandMode = useMemo(() => usesSandCompaction(soilType), [soilType]);

  const pdfWarnings = useMemo(
    () =>
      collectBoreholeWarnings({
        depthMeters: initial.depthMeters,
        latitude: initial.latitude,
        longitude: initial.longitude,
        layers: initial.layers,
        samples: initial.samples,
        equipment: initial.equipment,
        waterLevels: initial.waterLevels,
        photos: initial.photos,
        pmt: initial.pmtReadings,
        otv: initial.otvReadings,
        pp: initial.ppReadings,
        vst: initial.vstReadings,
        rqd: initial.rqdReadings,
      }),
    [initial],
  );

  const tabs = [
    ["data", t((m) => m.borehole.sections.data)],
    ["map", t((m) => m.borehole.sections.map)],
    ["lithology", t((m) => m.borehole.sections.lithology)],
    ["samples", t((m) => m.borehole.sections.samples)],
    ["water", t((m) => m.borehole.sections.water)],
    ["equipment", t((m) => m.borehole.sections.equipment)],
    ["pmt", t((m) => m.borehole.sections.pmt)],
    ["otv", t((m) => m.borehole.sections.otv)],
    ["pp", t((m) => m.borehole.sections.pp)],
    ["vst", t((m) => m.borehole.sections.vst)],
    ["rqd", t((m) => m.borehole.sections.rqd)],
    ["photos", t((m) => m.borehole.sections.photos)],
    ["fisa", t((m) => m.borehole.sections.fisa)],
  ] as const;

  async function saveCoords(nextLat: number, nextLng: number) {
    setLat(String(nextLat));
    setLng(String(nextLng));
    await fetch(`/api/boreholes/${initial.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude: nextLat, longitude: nextLng }),
    });
    router.refresh();
  }

  function useDeviceLocation() {
    if (!navigator.geolocation) {
      setMsg("Geolocation unavailable");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void saveCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => setMsg("Geolocation denied"),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  async function saveMeta(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/boreholes/${initial.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: fd.get("code"),
        depthMeters: fd.get("depthMeters"),
        latitude: lat || fd.get("latitude"),
        longitude: lng || fd.get("longitude"),
        kilometraj: fd.get("kilometraj"),
        tipInstalatie: fd.get("tipInstalatie"),
        intocmit: fd.get("intocmit"),
        categorie: fd.get("categorie"),
        notes: fd.get("notes"),
        drilledAt: fd.get("drilledAt") || null,
      }),
    });
    setMsg(res.ok ? "OK" : "Error");
    router.refresh();
  }

  async function addLayer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const type = String(fd.get("type") ?? "");
    await fetch(`/api/boreholes/${initial.id}/layers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromM: fd.get("fromM"),
        toM: fd.get("toM"),
        type,
        consistency: usesSandCompaction(type) ? null : fd.get("consistency"),
        sandCompaction: usesSandCompaction(type)
          ? fd.get("sandCompaction")
          : null,
        color: fd.get("color"),
        notes: fd.get("notes"),
      }),
    });
    form.reset();
    router.refresh();
  }

  async function addSample(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    await fetch(`/api/boreholes/${initial.id}/samples`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        depthM: fd.get("depthM"),
        type: fd.get("type"),
        sptValues: fd.get("sptValues"),
        notes: fd.get("notes"),
      }),
    });
    form.reset();
    router.refresh();
  }

  async function addWater(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    await fetch(`/api/boreholes/${initial.id}/water`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        duringM: fd.get("duringM"),
        after24hM: fd.get("after24hM"),
        notes: fd.get("notes"),
        date: fd.get("date") || null,
      }),
    });
    form.reset();
    router.refresh();
  }

  async function addEquipment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    await fetch(`/api/boreholes/${initial.id}/equipment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: fd.get("type"),
        fromM: fd.get("fromM"),
        toM: fd.get("toM"),
      }),
    });
    form.reset();
    router.refresh();
  }

  async function uploadPhotos(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const res = await fetch(`/api/boreholes/${initial.id}/photos`, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) {
      setMsg("Upload error");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 border-b border-line pb-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              tab === key
                ? "bg-accent text-white"
                : "bg-[#e4e8ec] text-ink hover:bg-[#d8dde3]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "data" ? (
        <form
          onSubmit={saveMeta}
          className="grid gap-3 rounded-lg border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <label className="text-xs">
            {t((m) => m.common.code)}
            <input
              name="code"
              defaultValue={initial.code}
              required
              className={inputCls}
            />
          </label>
          <label className="text-xs">
            {t((m) => m.borehole.depth)}
            <input
              name="depthMeters"
              type="number"
              step="0.01"
              defaultValue={initial.depthMeters ?? ""}
              className={inputCls}
            />
          </label>
          <label className="text-xs">
            {t((m) => m.common.date)}
            <input
              name="drilledAt"
              type="date"
              defaultValue={initial.drilledAt?.slice(0, 10) ?? ""}
              className={inputCls}
            />
          </label>
          <label className="text-xs">
            {t((m) => m.borehole.latitude)}
            <input
              name="latitude"
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="text-xs">
            {t((m) => m.borehole.longitude)}
            <input
              name="longitude"
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="text-xs">
            {t((m) => m.borehole.kilometraj)}
            <input
              name="kilometraj"
              defaultValue={initial.kilometraj ?? ""}
              className={inputCls}
            />
          </label>
          <label className="text-xs">
            {t((m) => m.borehole.tipInstalatie)}
            <input
              name="tipInstalatie"
              defaultValue={initial.tipInstalatie ?? ""}
              className={inputCls}
            />
          </label>
          <label className="text-xs">
            {t((m) => m.borehole.intocmit)}
            <input
              name="intocmit"
              defaultValue={initial.intocmit ?? ""}
              className={inputCls}
            />
          </label>
          <label className="text-xs">
            {t((m) => m.borehole.categorie)}
            <select
              name="categorie"
              defaultValue={initial.categorie ?? ""}
              className={inputCls}
            >
              <option value="">—</option>
              {BOREHOLE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {labelField(c, locale)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs sm:col-span-2 lg:col-span-3">
            {t((m) => m.common.notes)}
            <textarea
              name="notes"
              rows={2}
              defaultValue={initial.notes ?? ""}
              className={inputCls}
            />
          </label>
          <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-3">
            <button type="submit" className={btnPrimary}>
              {t((m) => m.borehole.saveMeta)}
            </button>
            {msg ? <span className="text-xs text-muted">{msg}</span> : null}
          </div>
        </form>
      ) : null}

      {tab === "lithology" ? (
        <div className="space-y-4">
          <form
            onSubmit={addLayer}
            className="grid gap-2 rounded-lg border border-line bg-panel p-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            <label className="text-xs">
              {t((m) => m.common.fromM)}
              <input name="fromM" type="number" step="0.01" required className={inputCls} />
            </label>
            <label className="text-xs">
              {t((m) => m.common.toM)}
              <input name="toM" type="number" step="0.01" required className={inputCls} />
            </label>
            <label className="text-xs">
              {t((m) => m.common.type)}
              <select
                name="type"
                className={inputCls}
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
              >
                {SOIL_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {labelField(s, locale)}
                  </option>
                ))}
              </select>
            </label>
            {sandMode ? (
              <label className="text-xs">
                {t((m) => m.borehole.sandCompaction)}
                <select name="sandCompaction" className={inputCls}>
                  {SAND_COMPACTION_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {labelField(s, locale)}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="text-xs">
                {t((m) => m.borehole.consistency)}
                <select name="consistency" className={inputCls}>
                  {CONSISTENCY_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {labelField(s, locale)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="text-xs">
              {t((m) => m.borehole.color)}
              <select name="color" className={inputCls}>
                {COLOR_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {labelField(s, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs">
              {t((m) => m.common.notes)}
              <input name="notes" className={inputCls} />
            </label>
            <div className="flex items-end">
              <button type="submit" className={btnPrimary}>
                {t((m) => m.common.add)}
              </button>
            </div>
          </form>
          <Table
            empty={t((m) => m.borehole.lithologyEmpty)}
            headers={[
              t((m) => m.common.fromM),
              t((m) => m.common.toM),
              t((m) => m.common.type),
              t((m) => m.borehole.consistency),
              t((m) => m.borehole.color),
              "",
            ]}
            rows={initial.layers.map((l) => [
              String(l.fromM),
              String(l.toM),
              labelField(l.type, locale),
              labelField(l.sandCompaction || l.consistency, locale),
              labelField(l.color, locale),
              <DeleteBtn
                key={l.id}
                label={t((m) => m.borehole.deleteLayer)}
                onClick={async () => {
                  await fetch(
                    `/api/boreholes/${initial.id}/layers/${l.id}`,
                    { method: "DELETE" },
                  );
                  router.refresh();
                }}
              />,
            ])}
          />
        </div>
      ) : null}

      {tab === "samples" ? (
        <div className="space-y-4">
          <form
            onSubmit={addSample}
            className="grid gap-2 rounded-lg border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            <label className="text-xs">
              {t((m) => m.common.depthM)}
              <input name="depthM" required className={inputCls} placeholder="2.00-2.40" />
            </label>
            <label className="text-xs">
              {t((m) => m.common.type)}
              <select name="type" className={inputCls}>
                {SAMPLE_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {labelField(s, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs">
              {t((m) => m.borehole.sptValues)}
              <input name="sptValues" className={inputCls} placeholder="4,6,8 sau 4.6.8" />
            </label>
            <label className="text-xs">
              {t((m) => m.common.notes)}
              <input name="notes" className={inputCls} />
            </label>
            <div className="flex items-end">
              <button type="submit" className={btnPrimary}>
                {t((m) => m.common.add)}
              </button>
            </div>
          </form>
          <Table
            empty={t((m) => m.borehole.samplesEmpty)}
            headers={[
              t((m) => m.common.depthM),
              t((m) => m.common.type),
              t((m) => m.borehole.sptValues),
              t((m) => m.common.notes),
              "",
            ]}
            rows={initial.samples.map((s) => [
              s.depthM,
              labelField(s.type, locale),
              s.sptValues ?? "—",
              s.notes ?? "—",
              <DeleteBtn
                key={s.id}
                label={t((m) => m.borehole.deleteSample)}
                onClick={async () => {
                  await fetch(
                    `/api/boreholes/${initial.id}/samples/${s.id}`,
                    { method: "DELETE" },
                  );
                  router.refresh();
                }}
              />,
            ])}
          />
        </div>
      ) : null}

      {tab === "water" ? (
        <div className="space-y-4">
          <form
            onSubmit={addWater}
            className="grid gap-2 rounded-lg border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            <label className="text-xs">
              {t((m) => m.borehole.duringM)}
              <input name="duringM" type="number" step="0.01" className={inputCls} />
            </label>
            <label className="text-xs">
              {t((m) => m.borehole.after24hM)}
              <input name="after24hM" type="number" step="0.01" className={inputCls} />
            </label>
            <label className="text-xs">
              {t((m) => m.common.date)}
              <input name="date" type="date" className={inputCls} />
            </label>
            <label className="text-xs">
              {t((m) => m.common.notes)}
              <input name="notes" className={inputCls} />
            </label>
            <div className="flex items-end">
              <button type="submit" className={btnPrimary}>
                {t((m) => m.common.add)}
              </button>
            </div>
          </form>
          <Table
            empty={t((m) => m.borehole.waterEmpty)}
            headers={[
              t((m) => m.common.date),
              t((m) => m.borehole.duringM),
              t((m) => m.borehole.after24hM),
              t((m) => m.common.notes),
              "",
            ]}
            rows={initial.waterLevels.map((w) => [
              w.date.slice(0, 10),
              w.duringM?.toString() ?? "—",
              w.after24hM?.toString() ?? "—",
              w.notes ?? "—",
              <DeleteBtn
                key={w.id}
                label={t((m) => m.borehole.deleteWater)}
                onClick={async () => {
                  await fetch(
                    `/api/boreholes/${initial.id}/water/${w.id}`,
                    { method: "DELETE" },
                  );
                  router.refresh();
                }}
              />,
            ])}
          />
        </div>
      ) : null}

      {tab === "equipment" ? (
        <div className="space-y-4">
          <form
            onSubmit={addEquipment}
            className="grid gap-2 rounded-lg border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <label className="text-xs">
              {t((m) => m.common.type)}
              <select name="type" className={inputCls}>
                {EQUIPMENT_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {labelField(s, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs">
              {t((m) => m.common.fromM)}
              <input name="fromM" type="number" step="0.01" required className={inputCls} />
            </label>
            <label className="text-xs">
              {t((m) => m.common.toM)}
              <input name="toM" type="number" step="0.01" required className={inputCls} />
            </label>
            <div className="flex items-end">
              <button type="submit" className={btnPrimary}>
                {t((m) => m.common.add)}
              </button>
            </div>
          </form>
          <Table
            empty={t((m) => m.borehole.equipmentEmpty)}
            headers={[
              t((m) => m.common.type),
              t((m) => m.common.fromM),
              t((m) => m.common.toM),
              "",
            ]}
            rows={initial.equipment.map((e) => [
              labelField(e.type, locale),
              String(e.fromM),
              String(e.toM),
              <DeleteBtn
                key={e.id}
                label={t((m) => m.borehole.deleteEquipment)}
                onClick={async () => {
                  await fetch(
                    `/api/boreholes/${initial.id}/equipment/${e.id}`,
                    { method: "DELETE" },
                  );
                  router.refresh();
                }}
              />,
            ])}
          />
        </div>
      ) : null}

      {tab === "photos" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 rounded-lg border border-line bg-panel p-4">
            <form onSubmit={uploadPhotos} className="flex flex-wrap items-end gap-3">
              <label className="text-xs">
                {t((m) => m.borehole.photoName)}
                <input
                  name="name"
                  type="text"
                  placeholder={t((m) => m.borehole.photoName)}
                  className={inputCls}
                />
              </label>
              <label className="text-xs">
                {t((m) => m.borehole.pickFromGallery)}
                <input
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  required
                  className={inputCls}
                />
              </label>
              <button type="submit" className={btnPrimary}>
                {t((m) => m.common.save)}
              </button>
            </form>
            <form onSubmit={uploadPhotos} className="flex flex-wrap items-end gap-3">
              <label className="text-xs">
                {t((m) => m.borehole.photoName)}
                <input
                  name="name"
                  type="text"
                  required
                  placeholder={t((m) => m.borehole.photoName)}
                  className={inputCls}
                />
              </label>
              <label className="text-xs">
                {t((m) => m.borehole.takePhoto)}
                <input
                  name="photos"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  required
                  className={inputCls}
                />
              </label>
              <button type="submit" className={btnPrimary}>
                {t((m) => m.common.save)}
              </button>
            </form>
          </div>
          {initial.photos.length === 0 ? (
            <p className="text-sm text-muted">{t((m) => m.borehole.photosEmpty)}</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {initial.photos.map((p) => (
                <li
                  key={p.id}
                  className="overflow-hidden rounded-lg border border-line bg-panel"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/files/${p.filePath}`}
                    alt={p.name || p.filePath}
                    className="h-40 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-2 p-2 text-xs">
                    <input
                      type="text"
                      defaultValue={p.name || ""}
                      placeholder={t((m) => m.borehole.photoName)}
                      className="min-w-0 flex-1 rounded border border-line bg-bg px-2 py-1"
                      onBlur={async (e) => {
                        const name = e.target.value.trim();
                        if (name === (p.name || "").trim()) return;
                        await fetch(
                          `/api/boreholes/${initial.id}/photos/${p.id}`,
                          {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ name }),
                          },
                        );
                        router.refresh();
                      }}
                    />
                    <DeleteBtn
                      label={t((m) => m.borehole.deletePhoto)}
                      onClick={async () => {
                        await fetch(
                          `/api/boreholes/${initial.id}/photos/${p.id}`,
                          { method: "DELETE" },
                        );
                        router.refresh();
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "map" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={useDeviceLocation} className={btnPrimary}>
              {t((m) => m.borehole.useMyLocation)}
            </button>
            <button
              type="button"
              onClick={() => setEditMapLocation((v) => !v)}
              className={editMapLocation ? btnPrimary : btnGhost}
            >
              {editMapLocation
                ? t((m) => m.borehole.stopEditLocation)
                : t((m) => m.borehole.editLocation)}
            </button>
            {lat && lng ? (
              <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noreferrer"
                className={btnGhost}
              >
                {t((m) => m.borehole.openGoogleMaps)}
              </a>
            ) : null}
            <span className="text-xs text-muted">
              {editMapLocation
                ? t((m) => m.borehole.setOnMap)
                : t((m) => m.borehole.viewMapHint)}
            </span>
          </div>
          <BoreholesMapClient
            pickMode={editMapLocation}
            onPick={
              editMapLocation
                ? (la, lo) => void saveCoords(la, lo)
                : undefined
            }
            height="420px"
            points={(() => {
              const others = (initial.mapPoints ?? []).filter(
                (p) => p.id !== initial.id,
              );
              const self =
                lat && lng
                  ? [
                      {
                        id: initial.id,
                        code: initial.code,
                        latitude: Number(lat),
                        longitude: Number(lng),
                        highlight: true,
                      },
                    ]
                  : [];
              return [...others, ...self];
            })()}
          />
        </div>
      ) : null}

      {tab === "pmt" ||
      tab === "otv" ||
      tab === "pp" ||
      tab === "vst" ||
      tab === "rqd" ? (
        <InsituPanels
          boreholeId={initial.id}
          kind={tab}
          pmt={initial.pmtReadings ?? []}
          otv={initial.otvReadings ?? []}
          pp={initial.ppReadings ?? []}
          vst={initial.vstReadings ?? []}
          rqd={initial.rqdReadings ?? []}
        />
      ) : null}

      {tab === "fisa" ? (
        <div className="space-y-3 rounded-lg border border-line bg-panel p-4">
          <label className="block text-xs">
            {t((m) => m.borehole.fisaLang)}
            <select
              className={inputCls}
              value={pdfLang}
              onChange={(e) => setPdfLang(e.target.value as Locale)}
            >
              <option value="ro">Română</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </label>

          {pdfWarnings.length > 0 ? (
            <div
              role="status"
              className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-950"
            >
              <p className="font-semibold">
                {t((m) => m.borehole.fisaWarningsTitle)} ({pdfWarnings.length})
              </p>
              <p className="mt-1 text-xs text-amber-800">
                {t((m) => m.borehole.fisaWarningsHint)}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                {pdfWarnings.map((w, i) => {
                  const key = w.code as keyof typeof messages.borehole.warnings;
                  const template =
                    messages.borehole.warnings[key] ?? w.code;
                  return (
                    <li key={`${w.code}-${i}`}>
                      {fillWarningTemplate(template, w.params)}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/api/boreholes/${initial.id}/fisa?lang=${pdfLang}`}
              className={`${btnPrimary} inline-block`}
              onClick={(e) => {
                if (pdfWarnings.length === 0) return;
                const lines = pdfWarnings.map((w) => {
                  const key = w.code as keyof typeof messages.borehole.warnings;
                  const template = messages.borehole.warnings[key] ?? w.code;
                  return `• ${fillWarningTemplate(template, w.params)}`;
                });
                const ok = window.confirm(
                  `${t((m) => m.borehole.fisaWarningsTitle)}\n\n${lines.join("\n")}\n\n${t((m) => m.borehole.fisaDownloadAnyway)}?`,
                );
                if (!ok) e.preventDefault();
              }}
            >
              {pdfWarnings.length > 0
                ? t((m) => m.borehole.fisaDownloadAnyway)
                : t((m) => m.borehole.downloadFisa)}
            </a>
            <a
              href={`/api/boreholes/${initial.id}/csv`}
              className={`${btnGhost} inline-block`}
            >
              {t((m) => m.borehole.downloadCsv)}
            </a>
          </div>
          <p className="text-xs text-muted">
            UI: {locale.toUpperCase()} · PDF: {pdfLang.toUpperCase()}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Table({
  headers,
  rows,
  empty,
}: {
  headers: string[];
  rows: React.ReactNode[][];
  empty: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-panel">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-sidebar text-muted">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-3 py-8 text-center text-muted"
              >
                {empty}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function DeleteBtn({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void | Promise<void>;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="text-xs text-red-700 hover:underline"
    >
      ×
    </button>
  );
}
