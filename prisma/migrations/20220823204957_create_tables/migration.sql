/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `links_user_room` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `rooms` table. All the data in the column will be lost.
  - Added the required column `is_adm` to the `links_user_room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_private` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "links_user_room" DROP COLUMN "isAdmin",
ADD COLUMN     "is_adm" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "isPrivate",
ADD COLUMN     "is_private" BOOLEAN NOT NULL;
