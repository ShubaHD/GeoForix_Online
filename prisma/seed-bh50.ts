/**
 * Seed / upsert a complete 50 m demo borehole under DEMO-GF.
 * Run: npx tsx prisma/seed-bh50.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  const existing = await prisma.borehole.findUnique({
    where: { projectId_code: { projectId: project.id, code: "BH50" } },
  });
  if (existing) {
    await prisma.borehole.delete({ where: { id: existing.id } });
    console.log("Removed previous BH50");
  }

  const borehole = await prisma.borehole.create({
    data: {
      projectId: project.id,
      code: "BH50",
      depthMeters: 50,
      latitude: 45.730208,
      longitude: 22.996426,
      kilometraj: "12+450",
      tipInstalatie: "Nordmeyer DSB 1/6",
      intocmit: "Ing. Demo GeoForix",
      categorie: "Structuri",
      notes: "Foraj demonstrativ complet 50 m",
      drilledAt: new Date("2026-03-15"),
      layers: {
        create: [
          {
            fromM: 0,
            toM: 0.5,
            type: "Sol vegetal",
            color: "BRUN NEGRICIOS",
            sortOrder: 0,
          },
          {
            fromM: 0.5,
            toM: 2.5,
            type: "Argila prafoasa",
            consistency: "Plastic consistent",
            color: "CAFENIU",
            sortOrder: 1,
          },
          {
            fromM: 2.5,
            toM: 6.0,
            type: "Nisip",
            sandCompaction: "Mediu indesat",
            color: "GALBUI",
            sortOrder: 2,
          },
          {
            fromM: 6.0,
            toM: 12.0,
            type: "Argila",
            consistency: "Plastic vartos",
            color: "CENUSIU",
            sortOrder: 3,
          },
          {
            fromM: 12.0,
            toM: 18.5,
            type: "Nisip cu pietris",
            sandCompaction: "Indesat",
            color: "CAFENIU GALBUI",
            sortOrder: 4,
          },
          {
            fromM: 18.5,
            toM: 28.0,
            type: "Argila grasa",
            consistency: "Plastic consistent",
            color: "CENUSIU VERZUI",
            sortOrder: 5,
          },
          {
            fromM: 28.0,
            toM: 36.0,
            type: "Pietris cu Nisip",
            sandCompaction: "Foarte indesat",
            color: "CENUSIU ALBICIOS",
            sortOrder: 6,
          },
          {
            fromM: 36.0,
            toM: 44.0,
            type: "Argila nisipoasa",
            consistency: "Plastic moale",
            color: "CAFENIU",
            sortOrder: 7,
          },
          {
            fromM: 44.0,
            toM: 50.0,
            type: "Roca",
            color: "CENUSIU NEGRICIOS",
            notes: "Marcă alterată",
            sortOrder: 8,
          },
        ],
      },
      samples: {
        create: [
          { depthM: "1.50-1.80", type: "Netulburată" },
          { depthM: "3.00", type: "SPT", sptValues: "3,5,7" },
          { depthM: "4.50-4.80", type: "Tulburată" },
          { depthM: "6.00", type: "SPT", sptValues: "5,8,10" },
          { depthM: "9.00", type: "SPT", sptValues: "7,9,11" },
          { depthM: "10.00-10.40", type: "Carotier Dublu" },
          { depthM: "12.00", type: "SPT", sptValues: "12,15,18" },
          { depthM: "15.00", type: "SPT", sptValues: "14,16,19" },
          { depthM: "16.50-16.90", type: "Calup" },
          { depthM: "18.00", type: "SPT", sptValues: "18,22,25" },
          { depthM: "21.00", type: "SPT", sptValues: "10,12,14" },
          { depthM: "24.00", type: "SPT", sptValues: "8,10,12" },
          { depthM: "25.00-25.50", type: "Carotier Triplu" },
          { depthM: "27.00", type: "SPT", sptValues: "9,11,13" },
          { depthM: "30.00", type: "SPT", sptValues: "25,30,35" },
          { depthM: "33.00", type: "SPT", sptValues: "28,32,38" },
          { depthM: "36.00", type: "SPT", sptValues: "20,24,28" },
          { depthM: "39.00", type: "SPT", sptValues: "11,13,15" },
          { depthM: "42.00", type: "SPT", sptValues: "12,14,16" },
          { depthM: "45.00", type: "SPT", sptValues: "35,40,45" },
          { depthM: "48.00", type: "SPT", sptValues: "40,45,50" },
        ],
      },
      waterLevels: {
        create: [
          {
            duringM: 8.5,
            after24hM: 7.8,
            notes: "Primul acvifer — nisip",
            date: new Date("2026-03-15"),
          },
          {
            duringM: 29.0,
            after24hM: 28.2,
            notes: "Al doilea nivel — pietriș",
            date: new Date("2026-03-16"),
          },
        ],
      },
      equipment: {
        create: [
          { type: "Tubaj Protecție", fromM: 0, toM: 12 },
          { type: "Tubaj Piezometric", fromM: 12, toM: 30 },
          { type: "Tub PVC", fromM: 30, toM: 50 },
        ],
      },
      pmtReadings: {
        create: [
          {
            presiometerType: "Menard",
            depthFromM: 5.0,
            depthToM: 5.8,
            testDate: new Date("2026-03-16"),
            notes: "În nisip",
          },
          {
            presiometerType: "OYO",
            depthFromM: 14.0,
            depthToM: 14.8,
            testDate: new Date("2026-03-16"),
            notes: null,
          },
          {
            presiometerType: "Menard",
            depthFromM: 32.0,
            depthToM: 32.8,
            testDate: new Date("2026-03-17"),
            notes: "În pietriș",
          },
        ],
      },
      otvReadings: {
        create: [
          {
            testKind: "OTV",
            depthFromM: 36.0,
            depthToM: 50.0,
            testDate: new Date("2026-03-17"),
            notes: "Interval stâncos",
          },
          {
            testKind: "OTV + Acustic",
            depthFromM: 44.0,
            depthToM: 50.0,
            testDate: new Date("2026-03-17"),
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
            valuesCsv: "1.2,1.4,1.5",
          },
          {
            plunger: "20mm",
            depthFrom: 7.0,
            depthTo: 8.0,
            valuesCsv: "2.0,2.2,2.1",
          },
          {
            plunger: "10mm",
            depthFrom: 19.0,
            depthTo: 20.0,
            valuesCsv: "3.5,3.8,4.0",
          },
        ],
      },
      vstReadings: {
        create: [
          {
            vaneSize: "3/4in (19mm) - soluri medii",
            depthFrom: 8.0,
            depthTo: 8.5,
            valueKgCm2: 0.45,
          },
          {
            vaneSize: "1in (25.4mm) - soluri tari",
            depthFrom: 20.0,
            depthTo: 20.5,
            valueKgCm2: 0.82,
          },
          {
            vaneSize: "1in (25.4mm) - soluri tari",
            depthFrom: 26.0,
            depthTo: 26.5,
            valueKgCm2: 0.91,
          },
        ],
      },
      rqdReadings: {
        create: [
          {
            depthFrom: 36.0,
            depthTo: 39.0,
            rqdPercent: 42,
            tcrPercent: 78,
            scrPercent: 55,
            scrRule: ">10cm",
          },
          {
            depthFrom: 39.0,
            depthTo: 42.0,
            rqdPercent: 55,
            tcrPercent: 85,
            scrPercent: 62,
            scrRule: ">10cm",
          },
          {
            depthFrom: 42.0,
            depthTo: 45.0,
            rqdPercent: 68,
            tcrPercent: 90,
            scrPercent: 71,
            scrRule: ">10cm",
          },
          {
            depthFrom: 45.0,
            depthTo: 50.0,
            rqdPercent: 75,
            tcrPercent: 95,
            scrPercent: 80,
            scrRule: ">10cm",
          },
        ],
      },
    },
  });

  console.log(`Created BH50 (${borehole.id}) — 50 m complete demo under DEMO-GF`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
