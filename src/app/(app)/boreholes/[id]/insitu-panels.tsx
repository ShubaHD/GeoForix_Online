"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";
import {
  OTV_TEST_KINDS,
  PMT_TYPES,
  PP_PLUNGER_OPTIONS,
  RQD_SCR_RULES,
  VST_VANE_SIZES,
  labelField,
} from "@/lib/field-options";

const inputCls =
  "mt-1 block w-full rounded border border-line bg-panel px-2 py-1.5 text-sm";
const btnPrimary =
  "rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90";

type Pmt = {
  id: string;
  presiometerType: string;
  depthFromM: number;
  depthToM: number;
  testDate: string;
  notes: string | null;
};
type Otv = {
  id: string;
  testKind: string;
  depthFromM: number;
  depthToM: number;
  testDate: string;
  notes: string | null;
};
type Pp = {
  id: string;
  plunger: string;
  depthFrom: number;
  depthTo: number;
  valuesCsv: string;
};
type Vst = {
  id: string;
  vaneSize: string;
  depthFrom: number;
  depthTo: number;
  valueKgCm2: number;
};
type Rqd = {
  id: string;
  depthFrom: number;
  depthTo: number;
  rqdPercent: number;
  tcrPercent: number;
  scrPercent: number;
  scrRule: string | null;
};

export function InsituPanels({
  boreholeId,
  kind,
  pmt,
  otv,
  pp,
  vst,
  rqd,
}: {
  boreholeId: string;
  kind: "pmt" | "otv" | "pp" | "vst" | "rqd";
  pmt: Pmt[];
  otv: Otv[];
  pp: Pp[];
  vst: Vst[];
  rqd: Rqd[];
}) {
  const { t, locale } = useI18n();
  const router = useRouter();

  async function del(path: string) {
    await fetch(path, { method: "DELETE" });
    router.refresh();
  }

  const title = t((m) => m.borehole.insituTitles[kind]);

  function Panel({ children }: { children: React.ReactNode }) {
    return (
      <div className="space-y-4">
        <h2 className="font-[family-name:var(--font-dm)] text-lg font-semibold text-ink">
          {title}
        </h2>
        {children}
      </div>
    );
  }

  if (kind === "pmt") {
    return (
      <Panel>
        <form
          className="grid gap-2 rounded-lg border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            await fetch(`/api/boreholes/${boreholeId}/pmt`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                presiometerType: fd.get("presiometerType"),
                depthFromM: fd.get("depthFromM"),
                depthToM: fd.get("depthToM"),
                testDate: fd.get("testDate") || null,
                notes: fd.get("notes"),
              }),
            });
            form.reset();
            router.refresh();
          }}
        >
          <label className="text-xs">
            Type
            <select name="presiometerType" className={inputCls} defaultValue="OYO">
              {PMT_TYPES.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            {t((m) => m.common.fromM)}
            <input name="depthFromM" type="number" step="0.01" required className={inputCls} />
          </label>
          <label className="text-xs">
            {t((m) => m.common.toM)}
            <input name="depthToM" type="number" step="0.01" required className={inputCls} />
          </label>
          <label className="text-xs">
            {t((m) => m.common.date)}
            <input name="testDate" type="date" className={inputCls} />
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
        <SimpleTable
          empty={t((m) => m.borehole.insituEmpty)}
          headers={["Type", t((m) => m.common.fromM), t((m) => m.common.toM), t((m) => m.common.date), ""]}
          rows={pmt.map((r) => [
            r.presiometerType,
            String(r.depthFromM),
            String(r.depthToM),
            r.testDate.slice(0, 10),
            <Del key={r.id} onClick={() => del(`/api/boreholes/${boreholeId}/pmt/${r.id}`)} />,
          ])}
        />
      </Panel>
    );
  }

  if (kind === "otv") {
    return (
      <Panel>
        <form
          className="grid gap-2 rounded-lg border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            await fetch(`/api/boreholes/${boreholeId}/otv`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                testKind: fd.get("testKind"),
                depthFromM: fd.get("depthFromM"),
                depthToM: fd.get("depthToM"),
                testDate: fd.get("testDate") || null,
                notes: fd.get("notes"),
              }),
            });
            form.reset();
            router.refresh();
          }}
        >
          <label className="text-xs">
            {t((m) => m.common.type)}
            <select name="testKind" className={inputCls}>
              {OTV_TEST_KINDS.map((x) => (
                <option key={x} value={x}>
                  {labelField(x, locale)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            {t((m) => m.common.fromM)}
            <input name="depthFromM" type="number" step="0.01" required className={inputCls} />
          </label>
          <label className="text-xs">
            {t((m) => m.common.toM)}
            <input name="depthToM" type="number" step="0.01" required className={inputCls} />
          </label>
          <label className="text-xs">
            {t((m) => m.common.date)}
            <input name="testDate" type="date" className={inputCls} />
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
        <SimpleTable
          empty={t((m) => m.borehole.insituEmpty)}
          headers={[t((m) => m.common.type), t((m) => m.common.fromM), t((m) => m.common.toM), t((m) => m.common.date), ""]}
          rows={otv.map((r) => [
            labelField(r.testKind, locale),
            String(r.depthFromM),
            String(r.depthToM),
            r.testDate.slice(0, 10),
            <Del key={r.id} onClick={() => del(`/api/boreholes/${boreholeId}/otv/${r.id}`)} />,
          ])}
        />
      </Panel>
    );
  }

  if (kind === "pp") {
    return (
      <Panel>
        <form
          className="grid gap-2 rounded-lg border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            await fetch(`/api/boreholes/${boreholeId}/pp`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                plunger: fd.get("plunger"),
                depthFrom: fd.get("depthFrom"),
                depthTo: fd.get("depthTo"),
                valuesCsv: fd.get("valuesCsv"),
              }),
            });
            form.reset();
            router.refresh();
          }}
        >
          <label className="text-xs">
            Plunger
            <select name="plunger" className={inputCls}>
              {PP_PLUNGER_OPTIONS.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            {t((m) => m.common.fromM)}
            <input name="depthFrom" type="number" step="0.01" required className={inputCls} />
          </label>
          <label className="text-xs">
            {t((m) => m.common.toM)}
            <input name="depthTo" type="number" step="0.01" required className={inputCls} />
          </label>
          <label className="text-xs sm:col-span-2">
            Values (kg/cm², comma)
            <input name="valuesCsv" placeholder="1.2,1.4,1.3" className={inputCls} />
          </label>
          <div className="flex items-end">
            <button type="submit" className={btnPrimary}>
              {t((m) => m.common.add)}
            </button>
          </div>
        </form>
        <SimpleTable
          empty={t((m) => m.borehole.insituEmpty)}
          headers={["Plunger", t((m) => m.common.fromM), t((m) => m.common.toM), "Values", ""]}
          rows={pp.map((r) => [
            r.plunger,
            String(r.depthFrom),
            String(r.depthTo),
            r.valuesCsv || "—",
            <Del key={r.id} onClick={() => del(`/api/boreholes/${boreholeId}/pp/${r.id}`)} />,
          ])}
        />
      </Panel>
    );
  }

  if (kind === "vst") {
    return (
      <Panel>
        <form
          className="grid gap-2 rounded-lg border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            await fetch(`/api/boreholes/${boreholeId}/vst`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                vaneSize: fd.get("vaneSize"),
                depthFrom: fd.get("depthFrom"),
                depthTo: fd.get("depthTo"),
                valueKgCm2: fd.get("valueKgCm2"),
              }),
            });
            form.reset();
            router.refresh();
          }}
        >
          <label className="text-xs lg:col-span-2">
            Vane
            <select name="vaneSize" className={inputCls}>
              {VST_VANE_SIZES.map((x) => (
                <option key={x} value={x}>
                  {labelField(x, locale)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            {t((m) => m.common.fromM)}
            <input name="depthFrom" type="number" step="0.01" required className={inputCls} />
          </label>
          <label className="text-xs">
            {t((m) => m.common.toM)}
            <input name="depthTo" type="number" step="0.01" required className={inputCls} />
          </label>
          <label className="text-xs">
            kg/cm²
            <input name="valueKgCm2" type="number" step="0.01" required className={inputCls} />
          </label>
          <div className="flex items-end">
            <button type="submit" className={btnPrimary}>
              {t((m) => m.common.add)}
            </button>
          </div>
        </form>
        <SimpleTable
          empty={t((m) => m.borehole.insituEmpty)}
          headers={["Vane", t((m) => m.common.fromM), t((m) => m.common.toM), "kg/cm²", ""]}
          rows={vst.map((r) => [
            labelField(r.vaneSize, locale),
            String(r.depthFrom),
            String(r.depthTo),
            String(r.valueKgCm2),
            <Del key={r.id} onClick={() => del(`/api/boreholes/${boreholeId}/vst/${r.id}`)} />,
          ])}
        />
      </Panel>
    );
  }

  return (
    <Panel>
      <form
        className="grid gap-2 rounded-lg border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const fd = new FormData(form);
          await fetch(`/api/boreholes/${boreholeId}/rqd`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              depthFrom: fd.get("depthFrom"),
              depthTo: fd.get("depthTo"),
              rqdPercent: fd.get("rqdPercent"),
              tcrPercent: fd.get("tcrPercent"),
              scrPercent: fd.get("scrPercent"),
              scrRule: fd.get("scrRule"),
            }),
          });
          form.reset();
          router.refresh();
        }}
      >
        <label className="text-xs">
          {t((m) => m.common.fromM)}
          <input name="depthFrom" type="number" step="0.01" required className={inputCls} />
        </label>
        <label className="text-xs">
          {t((m) => m.common.toM)}
          <input name="depthTo" type="number" step="0.01" required className={inputCls} />
        </label>
        <label className="text-xs">
          RQD %
          <input name="rqdPercent" type="number" step="0.1" required className={inputCls} />
        </label>
        <label className="text-xs">
          TCR %
          <input name="tcrPercent" type="number" step="0.1" className={inputCls} />
        </label>
        <label className="text-xs">
          SCR %
          <input name="scrPercent" type="number" step="0.1" className={inputCls} />
        </label>
        <label className="text-xs">
          SCR rule
          <select name="scrRule" className={inputCls} defaultValue="">
            <option value="">—</option>
            {RQD_SCR_RULES.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button type="submit" className={btnPrimary}>
            {t((m) => m.common.add)}
          </button>
        </div>
      </form>
      <SimpleTable
        empty={t((m) => m.borehole.insituEmpty)}
        headers={[
          t((m) => m.common.fromM),
          t((m) => m.common.toM),
          "RQD%",
          "TCR%",
          "SCR%",
          "",
        ]}
        rows={rqd.map((r) => [
          String(r.depthFrom),
          String(r.depthTo),
          String(r.rqdPercent),
          String(r.tcrPercent),
          String(r.scrPercent),
          <Del key={r.id} onClick={() => del(`/api/boreholes/${boreholeId}/rqd/${r.id}`)} />,
        ])}
      />
    </Panel>
  );
}

function Del({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-xs text-red-700 hover:underline">
      ×
    </button>
  );
}

function SimpleTable({
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
              <td colSpan={headers.length} className="px-3 py-8 text-center text-muted">
                {empty}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
