import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function seedUsers() {
  const users = [
    {
      email: "admin@geoforix.local",
      name: "Admin",
      role: "ADMIN",
      password: "admin123",
    },
    {
      email: "field@geoforix.local",
      name: "Teren",
      role: "FIELD",
      password: "field123",
    },
  ];

  for (const u of users) {
    const passwordHash = await hashPassword(u.password);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, passwordHash },
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        passwordHash,
      },
    });
  }
  console.log("Users seeded (admin/field @ geoforix.local)");
}

async function seedDemo() {
  const existing = await prisma.project.findUnique({ where: { code: "DEMO-GF" } });
  if (existing) {
    console.log("Demo project already exists");
    return;
  }

  await prisma.project.create({
    data: {
      code: "DEMO-GF",
      name: "Proiect demonstrație GeoForix",
      topic: "Investigare geotehnică",
      location: "Str. Exemplu, București",
      client: "Client Demo",
      description: "Proiect seed pentru testare UI / PDF",
      boreholes: {
        create: {
          code: "BH01",
          depthMeters: 12.5,
          latitude: 44.4268,
          longitude: 26.1025,
          categorie: "General",
          intocmit: "Inginer Demo",
          layers: {
            create: [
              {
                fromM: 0,
                toM: 0.4,
                type: "Sol vegetal",
                color: "BRUN NEGRICIOS",
                sortOrder: 0,
              },
              {
                fromM: 0.4,
                toM: 3.2,
                type: "Argila",
                consistency: "Plastic consistent",
                color: "CENUSIU",
                sortOrder: 1,
              },
              {
                fromM: 3.2,
                toM: 6.0,
                type: "Nisip",
                sandCompaction: "Mediu indesat",
                color: "GALBUI",
                sortOrder: 2,
              },
            ],
          },
          samples: {
            create: [
              {
                depthM: "2.00-2.40",
                type: "Netulburată",
                notes: "Proba demo",
              },
              {
                depthM: "4.50",
                type: "SPT",
                sptValues: "4,6,8",
              },
            ],
          },
          waterLevels: {
            create: {
              duringM: 4.2,
              after24hM: 3.9,
              notes: "Nivel hidrostatic",
            },
          },
          equipment: {
            create: {
              type: "Tubaj Protecție",
              fromM: 0,
              toM: 6,
            },
          },
        },
      },
    },
  });
  console.log("Demo project DEMO-GF / BH01 created");
}

async function main() {
  await seedUsers();
  await seedDemo();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
