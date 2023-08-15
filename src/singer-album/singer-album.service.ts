import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, SingerAlbum, Song, User } from '@prisma/client';
import { SingerAlbumResponse } from './dto/singer-album-response';
import { UpdateSingerAlbumDto } from './dto/update-singer-album-dto';
import { UploadService } from '../upload/upload.service';
import { CreateSongDto } from '../song/dto/create-song-dto';
import { SongService } from '../song/song.service';
import { JwtPayload } from '@app/common';
import { UserService } from '../user/user.service';

@Injectable()
export class SingerAlbumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly songService: SongService,
    private readonly userService: UserService,
  ) {}

  async isAuthorizedUser(singerAlbumId: number, decodedUser: JwtPayload) {
    const singerAlbum: SingerAlbum = await this.getOne(singerAlbumId);
    const user: User = await this.userService.getOne(decodedUser.id);
    if (singerAlbum.userId !== decodedUser.id || user.role == Role.ADMIN) {
      throw new UnauthorizedException('Unauthorized User!');
    }
  }

  private deleteSingerAlbumField(singerAlbum: SingerAlbum): void {
    delete singerAlbum.singerId;
  }

  async getAll(): Promise<SingerAlbumResponse[]> {
    return await this.prisma.singerAlbum.findMany({
      select: {
        id: true,
        name: true,
        photo: true,
        photoName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getOne(singerAlbumId: number): Promise<SingerAlbum> {
    const singerAlbum: SingerAlbum = await this.prisma.singerAlbum.findUnique({
      where: { id: singerAlbumId },
    });
    if (!singerAlbum) {
      throw new NotFoundException('Singer album not found!');
    }
    this.deleteSingerAlbumField(singerAlbum);
    return singerAlbum;
  }

  async update(
    singerAlbumData: UpdateSingerAlbumDto,
    singerAlbumId: number,
    file: Express.Multer.File,
    decodedUser: JwtPayload,
  ): Promise<SingerAlbum> {
    await this.getOne(singerAlbumId);
    await this.isAuthorizedUser(singerAlbumId, decodedUser);
    if (file) {
      await this.uploadService.upload(file.originalname, file.buffer);
    }
    return await this.prisma.singerAlbum.update({
      where: { id: singerAlbumId },
      data: {
        ...singerAlbumData,
        photoName: file ? file.originalname : null,
      },
    });
  }

  async createSong(
    songData: CreateSongDto,
    singerAlbumId: number,
    file: Express.Multer.File,
    decodedUser: JwtPayload,
  ): Promise<Song> {
    if (file) {
      await this.uploadService.upload(file.originalname, file.buffer);
    }

    const song: Song = await this.prisma.song.create({
      data: {
        ...songData,
        rate: +songData.rate,
        singerAlbumId,
        photoName: file ? file.originalname : null,
        userId: decodedUser.id,
      },
    });

    this.songService.deleteSongFields(song);

    return song;
  }
}
