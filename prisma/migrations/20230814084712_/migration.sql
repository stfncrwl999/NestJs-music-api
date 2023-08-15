/*
  Warnings:

  - You are about to drop the column `photo` on the `Singer` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `SingerAlbum` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Favourite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SongsOnFavourites` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Singer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Singer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SongsOnFavourites" DROP CONSTRAINT "SongsOnFavourites_favouriteId_fkey";

-- DropForeignKey
ALTER TABLE "SongsOnFavourites" DROP CONSTRAINT "SongsOnFavourites_songId_fkey";

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Singer" DROP COLUMN "photo",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SingerAlbum" DROP COLUMN "photo",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "photo",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "photo";

-- DropTable
DROP TABLE "Favourite";

-- DropTable
DROP TABLE "SongsOnFavourites";

-- CreateIndex
CREATE UNIQUE INDEX "Singer_userId_key" ON "Singer"("userId");

-- AddForeignKey
ALTER TABLE "Singer" ADD CONSTRAINT "Singer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SingerAlbum" ADD CONSTRAINT "SingerAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
