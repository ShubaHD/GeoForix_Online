-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'FIELD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "topic" TEXT,
    "location" TEXT,
    "client" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Borehole" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "depthMeters" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "kilometraj" TEXT,
    "tipInstalatie" TEXT,
    "intocmit" TEXT,
    "categorie" TEXT,
    "notes" TEXT,
    "drilledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Borehole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LithologyLayer" (
    "id" TEXT NOT NULL,
    "boreholeId" TEXT NOT NULL,
    "fromM" DOUBLE PRECISION NOT NULL,
    "toM" DOUBLE PRECISION NOT NULL,
    "type" TEXT,
    "consistency" TEXT,
    "sandCompaction" TEXT,
    "color" TEXT,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LithologyLayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sample" (
    "id" TEXT NOT NULL,
    "boreholeId" TEXT NOT NULL,
    "depthM" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sptValues" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterLevel" (
    "id" TEXT NOT NULL,
    "boreholeId" TEXT NOT NULL,
    "duringM" DOUBLE PRECISION,
    "after24hM" DOUBLE PRECISION,
    "notes" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaterLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "boreholeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fromM" DOUBLE PRECISION NOT NULL,
    "toM" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "boreholeId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "filePath" TEXT NOT NULL,
    "depthM" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PmtReading" (
    "id" TEXT NOT NULL,
    "boreholeId" TEXT NOT NULL,
    "presiometerType" TEXT NOT NULL DEFAULT 'OYO',
    "depthFromM" DOUBLE PRECISION NOT NULL,
    "depthToM" DOUBLE PRECISION NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "PmtReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtvReading" (
    "id" TEXT NOT NULL,
    "boreholeId" TEXT NOT NULL,
    "testKind" TEXT NOT NULL,
    "depthFromM" DOUBLE PRECISION NOT NULL,
    "depthToM" DOUBLE PRECISION NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "OtvReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PpReading" (
    "id" TEXT NOT NULL,
    "boreholeId" TEXT NOT NULL,
    "plunger" TEXT NOT NULL,
    "depthFrom" DOUBLE PRECISION NOT NULL,
    "depthTo" DOUBLE PRECISION NOT NULL,
    "valuesCsv" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PpReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VstReading" (
    "id" TEXT NOT NULL,
    "boreholeId" TEXT NOT NULL,
    "vaneSize" TEXT NOT NULL,
    "depthFrom" DOUBLE PRECISION NOT NULL,
    "depthTo" DOUBLE PRECISION NOT NULL,
    "valueKgCm2" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VstReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RqdReading" (
    "id" TEXT NOT NULL,
    "boreholeId" TEXT NOT NULL,
    "depthFrom" DOUBLE PRECISION NOT NULL,
    "depthTo" DOUBLE PRECISION NOT NULL,
    "rqdPercent" DOUBLE PRECISION NOT NULL,
    "tcrPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scrPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scrRule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RqdReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanySettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT NOT NULL DEFAULT '',
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "vatId" TEXT,
    "logoPath" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanySettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Borehole_projectId_code_key" ON "Borehole"("projectId", "code");

-- AddForeignKey
ALTER TABLE "Borehole" ADD CONSTRAINT "Borehole_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LithologyLayer" ADD CONSTRAINT "LithologyLayer_boreholeId_fkey" FOREIGN KEY ("boreholeId") REFERENCES "Borehole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_boreholeId_fkey" FOREIGN KEY ("boreholeId") REFERENCES "Borehole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterLevel" ADD CONSTRAINT "WaterLevel_boreholeId_fkey" FOREIGN KEY ("boreholeId") REFERENCES "Borehole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_boreholeId_fkey" FOREIGN KEY ("boreholeId") REFERENCES "Borehole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_boreholeId_fkey" FOREIGN KEY ("boreholeId") REFERENCES "Borehole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PmtReading" ADD CONSTRAINT "PmtReading_boreholeId_fkey" FOREIGN KEY ("boreholeId") REFERENCES "Borehole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtvReading" ADD CONSTRAINT "OtvReading_boreholeId_fkey" FOREIGN KEY ("boreholeId") REFERENCES "Borehole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PpReading" ADD CONSTRAINT "PpReading_boreholeId_fkey" FOREIGN KEY ("boreholeId") REFERENCES "Borehole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VstReading" ADD CONSTRAINT "VstReading_boreholeId_fkey" FOREIGN KEY ("boreholeId") REFERENCES "Borehole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RqdReading" ADD CONSTRAINT "RqdReading_boreholeId_fkey" FOREIGN KEY ("boreholeId") REFERENCES "Borehole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

