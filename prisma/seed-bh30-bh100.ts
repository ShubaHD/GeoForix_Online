/**
 * Seed complete demo boreholes BH30 (30 m) and BH100 (100 m) under DEMO-GF.
 * Run: npx tsx prisma/seed-bh30-bh100.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type LayerIn = {
  fromM: number;
  toM: number;
  type: string;
  color: string;
  consistency?: string;
  sandCompaction?: string;
  notes?: string;
};

function layersCreate(items: LayerIn[]) {
  return {
    create: items.map((l, i) => ({
      fromM: l.fromM,
      toM: l.toM,
      type: l.type,
      color: l.color,
      consistency: l.consistency ?? null,
      sandCompaction: l.sandCompaction ?? null,
      notes: l.notes ?? null,
      sortOrder: i,
    })),
  };
}

async function upsertBorehole(
  projectId: string,
  code: string,
  data: Parameters<typeof prisma.borehole.create>[0]["data"],
) {
  const existing = await prisma.borehole.findUnique({
    where: { projectId_code: { projectId, code } },
  });
  if (existing) {
    await prisma.borehole.delete({ where: { id: existing.id } });
    console.log(`Removed previous ${code}`);
  }
  const bh = await prisma.borehole.create({ data: { ...data, projectId, code } });
  console.log(`Created ${code} (${bh.id}) — ${data.depthMeters} m`);
}

async function main() {
  const project = await prisma.project.upsert({
    where: { code: "DEMO-GF" },
    update: {},
    create: {
      code: "DEMO-GF",
      name: "Proiect demonstrație GeoForix",
      topic: "Investigare geotehnică",
      location: "Str. Exemplu, București",
      client: "Client Demo",
      description: "Proiect seed pentru testare UI / PDF",
    },
  });

  // ——— BH30 — 30 m ———
  await upsertBorehole(project.id, "BH30", {
    depthMeters: 30,
    latitude: 45.7311,
    longitude: 22.9978,
    kilometraj: "8+120",
    tipInstalatie: "Cordrill 650",
    intocmit: "Ing. Demo GeoForix",
    categorie: "Drum",
    notes: "Foraj demonstrativ complet 30 m",
    drilledAt: new Date("2026-04-02"),
    layers: layersCreate([
      { fromM: 0, toM: 0.4, type: "Sol vegetal", color: "BRUN NEGRICIOS" },
      {
        fromM: 0.4,
        toM: 3.0,
        type: "Argila prafoasa",
        consistency: "Plastic consistent",
        color: "CAFENIU",
      },
      {
        fromM: 3.0,
        toM: 8.0,
        type: "Nisip",
        sandCompaction: "Mediu indesat",
        color: "GALBUI",
      },
      {
        fromM: 8.0,
        toM: 15.0,
        type: "Argila",
        consistency: "Plastic vartos",
        color: "CENUSIU",
      },
      {
        fromM: 15.0,
        toM: 22.0,
        type: "Nisip cu pietris",
        sandCompaction: "Indesat",
        color: "CAFENIU GALBUI",
      },
      {
        fromM: 22.0,
        toM: 30.0,
        type: "Argila grasa",
        consistency: "Plastic tare",
        color: "CENUSIU VERZUI",
      },
    ]),
    samples: {
      create: [
        { depthM: "1.20-1.50", type: "Netulburată" },
        { depthM: "3.00", type: "SPT", sptValues: "4,5,6" },
        { depthM: "5.00", type: "SPT", sptValues: "6,7,9" },
        { depthM: "6.50-6.90", type: "Tulburată" },
        { depthM: "8.00", type: "SPT", sptValues: "8,10,12" },
        { depthM: "11.00", type: "SPT", sptValues: "10,12,14" },
        { depthM: "12.00-12.40", type: "Carotier Dublu" },
        { depthM: "14.00", type: "SPT", sptValues: "11,13,15" },
        { depthM: "17.00", type: "SPT", sptValues: "16,18,22" },
        { depthM: "18.50-18.90", type: "Calup" },
        { depthM: "20.00", type: "SPT", sptValues: "18,20,24" },
        { depthM: "23.00", type: "SPT", sptValues: "9,11,13" },
        { depthM: "26.00", type: "SPT", sptValues: "10,12,14" },
        { depthM: "28.00", type: "SPT", sptValues: "12,14,16" },
        { depthM: "29.00-29.40", type: "Carotier Triplu" },
      ],
    },
    waterLevels: {
      create: [
        {
          duringM: 6.2,
          after24hM: 5.8,
          notes: "Acvifer nisip",
          date: new Date("2026-04-02"),
        },
      ],
    },
    equipment: {
      create: [
        { type: "Tubaj Protecție", fromM: 0, toM: 8 },
        { type: "Tubaj Piezometric", fromM: 8, toM: 22 },
        { type: "Tub PVC", fromM: 22, toM: 30 },
      ],
    },
    pmtReadings: {
      create: [
        {
          presiometerType: "Menard",
          depthFromM: 4.0,
          depthToM: 4.8,
          testDate: new Date("2026-04-03"),
          notes: "Nisip",
        },
        {
          presiometerType: "OYO",
          depthFromM: 16.0,
          depthToM: 16.8,
          testDate: new Date("2026-04-03"),
          notes: null,
        },
      ],
    },
    otvReadings: {
      create: [
        {
          testKind: "OTV",
          depthFromM: 22.0,
          depthToM: 30.0,
          testDate: new Date("2026-04-03"),
          notes: null,
        },
      ],
    },
    ppReadings: {
      create: [
        {
          plunger: "15mm",
          depthFrom: 1.0,
          depthTo: 2.0,
          valuesCsv: "1.1,1.3,1.4",
        },
        {
          plunger: "20mm",
          depthFrom: 9.0,
          depthTo: 10.0,
          valuesCsv: "2.2,2.4,2.5",
        },
      ],
    },
    vstReadings: {
      create: [
        {
          vaneSize: "3/4in (19mm) - soluri medii",
          depthFrom: 9.0,
          depthTo: 9.5,
          valueKgCm2: 0.52,
        },
        {
          vaneSize: "1in (25.4mm) - soluri tari",
          depthFrom: 24.0,
          depthTo: 24.5,
          valueKgCm2: 0.88,
        },
      ],
    },
    rqdReadings: {
      create: [
        {
          depthFrom: 22.0,
          depthTo: 26.0,
          rqdPercent: 35,
          tcrPercent: 70,
          scrPercent: 48,
          scrRule: ">10cm",
        },
        {
          depthFrom: 26.0,
          depthTo: 30.0,
          rqdPercent: 48,
          tcrPercent: 82,
          scrPercent: 60,
          scrRule: ">10cm",
        },
      ],
    },
  });

  // ——— BH100 — 100 m ———
  const spt100 = [];
  for (let d = 3; d <= 98; d += 3) {
    const n1 = 4 + Math.floor(d / 8);
    const n2 = n1 + 2 + (d % 5);
    const n3 = n2 + 2 + (d % 3);
    spt100.push({
      depthM: String(d),
      type: "SPT" as const,
      sptValues: `${n1},${n2},${n3}`,
    });
  }

  await upsertBorehole(project.id, "BH100", {
    depthMeters: 100,
    latitude: 45.7285,
    longitude: 22.9942,
    kilometraj: "15+780",
    tipInstalatie: "Nordmeyer DSB 2/12",
    intocmit: "Ing. Demo GeoForix",
    categorie: "Structuri",
    notes: "Foraj demonstrativ complet 100 m — test paginare PDF",
    drilledAt: new Date("2026-05-10"),
    layers: layersCreate([
      { fromM: 0, toM: 0.6, type: "Sol vegetal", color: "BRUN NEGRICIOS" },
      {
        fromM: 0.6,
        toM: 4.0,
        type: "Argila prafoasa",
        consistency: "Plastic moale",
        color: "CAFENIU",
      },
      {
        fromM: 4.0,
        toM: 10.0,
        type: "Nisip",
        sandCompaction: "Afânat",
        color: "GALBUI",
      },
      {
        fromM: 10.0,
        toM: 18.0,
        type: "Argila",
        consistency: "Plastic consistent",
        color: "CENUSIU",
      },
      {
        fromM: 18.0,
        toM: 28.0,
        type: "Nisip prafos",
        sandCompaction: "Mediu indesat",
        color: "GALBUI ALBICIOS",
      },
      {
        fromM: 28.0,
        toM: 40.0,
        type: "Argila grasa",
        consistency: "Plastic vartos",
        color: "CENUSIU VERZUI",
      },
      {
        fromM: 40.0,
        toM: 52.0,
        type: "Nisip cu pietris",
        sandCompaction: "Indesat",
        color: "CAFENIU GALBUI",
      },
      {
        fromM: 52.0,
        toM: 65.0,
        type: "Argila nisipoasa",
        consistency: "Plastic consistent",
        color: "CAFENIU",
      },
      {
        fromM: 65.0,
        toM: 78.0,
        type: "Pietris cu Nisip",
        sandCompaction: "Foarte indesat",
        color: "CENUSIU ALBICIOS",
      },
      {
        fromM: 78.0,
        toM: 90.0,
        type: "Argila",
        consistency: "Plastic tare",
        color: "CENUSIU NEGRICIOS",
      },
      {
        fromM: 90.0,
        toM: 100.0,
        type: "Roca",
        color: "CENUSIU NEGRICIOS",
        notes: "Marcă alterată / fisurată",
      },
    ]),
    samples: {
      create: [
        { depthM: "2.00-2.40", type: "Netulburată" },
        { depthM: "7.00-7.40", type: "Tulburată" },
        { depthM: "15.00-15.50", type: "Carotier Dublu" },
        { depthM: "25.00-25.40", type: "Calup" },
        { depthM: "45.00-45.50", type: "Carotier Triplu" },
        { depthM: "70.00-70.50", type: "Carotier Dublu" },
        { depthM: "92.00-93.00", type: "Carotier Triplu" },
        ...spt100,
      ],
    },
    waterLevels: {
      create: [
        {
          duringM: 9.5,
          after24hM: 8.8,
          notes: "Acvifer superior",
          date: new Date("2026-05-10"),
        },
        {
          duringM: 42.0,
          after24hM: 41.2,
          notes: "Acvifer pietriș",
          date: new Date("2026-05-12"),
        },
        {
          duringM: 68.0,
          after24hM: 67.5,
          notes: "Nivel profund",
          date: new Date("2026-05-14"),
        },
      ],
    },
    equipment: {
      create: [
        { type: "Tubaj Protecție", fromM: 0, toM: 18 },
        { type: "Tubaj Piezometric", fromM: 18, toM: 52 },
        { type: "Tubaj Inclinometric", fromM: 52, toM: 78 },
        { type: "Tub Metalic", fromM: 78, toM: 100 },
      ],
    },
    pmtReadings: {
      create: [
        {
          presiometerType: "Menard",
          depthFromM: 6.0,
          depthToM: 6.8,
          testDate: new Date("2026-05-11"),
          notes: null,
        },
        {
          presiometerType: "OYO",
          depthFromM: 22.0,
          depthToM: 22.8,
          testDate: new Date("2026-05-11"),
          notes: null,
        },
        {
          presiometerType: "Menard",
          depthFromM: 48.0,
          depthToM: 48.8,
          testDate: new Date("2026-05-13"),
          notes: "Pietriș",
        },
        {
          presiometerType: "OYO",
          depthFromM: 72.0,
          depthToM: 72.8,
          testDate: new Date("2026-05-14"),
          notes: null,
        },
      ],
    },
    otvReadings: {
      create: [
        {
          testKind: "OTV",
          depthFromM: 78.0,
          depthToM: 90.0,
          testDate: new Date("2026-05-15"),
          notes: null,
        },
        {
          testKind: "OTV + Acustic",
          depthFromM: 90.0,
          depthToM: 100.0,
          testDate: new Date("2026-05-15"),
          notes: "Rocă",
        },
      ],
    },
    ppReadings: {
      create: [
        {
          plunger: "15mm",
          depthFrom: 2.0,
          depthTo: 3.0,
          valuesCsv: "1.0,1.2,1.3",
        },
        {
          plunger: "20mm",
          depthFrom: 12.0,
          depthTo: 13.0,
          valuesCsv: "2.5,2.7,2.8",
        },
        {
          plunger: "10mm",
          depthFrom: 32.0,
          depthTo: 33.0,
          valuesCsv: "3.8,4.0,4.2",
        },
      ],
    },
    vstReadings: {
      create: [
        {
          vaneSize: "3/4in (19mm) - soluri medii",
          depthFrom: 11.0,
          depthTo: 11.5,
          valueKgCm2: 0.48,
        },
        {
          vaneSize: "1in (25.4mm) - soluri tari",
          depthFrom: 32.0,
          depthTo: 32.5,
          valueKgCm2: 0.95,
        },
        {
          vaneSize: "1in (25.4mm) - soluri tari",
          depthFrom: 58.0,
          depthTo: 58.5,
          valueKgCm2: 1.12,
        },
      ],
    },
    rqdReadings: {
      create: [
        {
          depthFrom: 90.0,
          depthTo: 93.0,
          rqdPercent: 40,
          tcrPercent: 75,
          scrPercent: 52,
          scrRule: ">10cm",
        },
        {
          depthFrom: 93.0,
          depthTo: 96.0,
          rqdPercent: 58,
          tcrPercent: 88,
          scrPercent: 65,
          scrRule: ">10cm",
        },
        {
          depthFrom: 96.0,
          depthTo: 100.0,
          rqdPercent: 72,
          tcrPercent: 94,
          scrPercent: 78,
          scrRule: ">10cm",
        },
      ],
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
