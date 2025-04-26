-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TrackingMethod" AS ENUM ('TASKS', 'MILESTONES');

-- CreateEnum
CREATE TYPE "AmbitionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'INACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ambitions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "themeColor" TEXT NOT NULL,
    "trackingMethod" "TrackingMethod" NOT NULL,
    "timeTrackingStart" TIMESTAMP(3) NOT NULL,
    "timeTrackingEnd" TIMESTAMP(3) NOT NULL,
    "timeTrackingDuration" INTEGER NOT NULL,
    "timeTrackingUnit" TEXT NOT NULL,
    "timeTrackingStatus" TEXT NOT NULL,
    "status" "AmbitionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ambitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbitionTasks" (
    "id" TEXT NOT NULL,
    "ambitionId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmbitionTasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbitionMilestones" (
    "id" TEXT NOT NULL,
    "ambitionId" TEXT NOT NULL,
    "milestone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmbitionMilestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbitionNotes" (
    "id" TEXT NOT NULL,
    "ambitionId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmbitionNotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Ambitions" ADD CONSTRAINT "Ambitions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbitionTasks" ADD CONSTRAINT "AmbitionTasks_ambitionId_fkey" FOREIGN KEY ("ambitionId") REFERENCES "Ambitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbitionMilestones" ADD CONSTRAINT "AmbitionMilestones_ambitionId_fkey" FOREIGN KEY ("ambitionId") REFERENCES "Ambitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbitionNotes" ADD CONSTRAINT "AmbitionNotes_ambitionId_fkey" FOREIGN KEY ("ambitionId") REFERENCES "Ambitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
