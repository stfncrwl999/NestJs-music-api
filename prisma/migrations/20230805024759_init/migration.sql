-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "SingerType" AS ENUM ('SINGLE', 'BAND');

-- CreateEnum
CREATE TYPE "SongType" AS ENUM ('CLASSICAL', 'POP', 'ROCK', 'METAL', 'COUNTRY', 'HIP_HOP', 'BALLADS', 'DANCE', 'LOVE', 'GOSPEL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT,
    "photoName" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "refreshToken" TEXT,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Singer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "info" TEXT NOT NULL,
    "type" "SingerType" NOT NULL,
    "photo" TEXT,
    "photoName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Singer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SingerAlbum" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "photoName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "singerId" INTEGER,

    CONSTRAINT "SingerAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "type" "SongType" NOT NULL,
    "language" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "photo" TEXT,
    "photoName" TEXT,
    "singerAlbumId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favourite" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favourite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongsOnFavourites" (
    "songId" INTEGER NOT NULL,
    "favouriteId" INTEGER NOT NULL,

    CONSTRAINT "SongsOnFavourites_pkey" PRIMARY KEY ("songId","favouriteId")
);

-- CreateTable
CREATE TABLE "SongsOnPlaylists" (
    "songId" INTEGER NOT NULL,
    "playlistId" INTEGER NOT NULL,

    CONSTRAINT "SongsOnPlaylists_pkey" PRIMARY KEY ("songId","playlistId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "SingerAlbum" ADD CONSTRAINT "SingerAlbum_singerId_fkey" FOREIGN KEY ("singerId") REFERENCES "Singer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_singerAlbumId_fkey" FOREIGN KEY ("singerAlbumId") REFERENCES "SingerAlbum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongsOnFavourites" ADD CONSTRAINT "SongsOnFavourites_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongsOnFavourites" ADD CONSTRAINT "SongsOnFavourites_favouriteId_fkey" FOREIGN KEY ("favouriteId") REFERENCES "Favourite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongsOnPlaylists" ADD CONSTRAINT "SongsOnPlaylists_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongsOnPlaylists" ADD CONSTRAINT "SongsOnPlaylists_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
