import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaylistDto } from './dto/create-playlist-dto';
import { Playlist, Role, Singer, User } from '@prisma/client';
import { UpdatePlaylistDto } from './dto/update-playlist-dto';
import { JwtPayload } from '@app/common';
import { UserService } from '../user/user.service';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async isAuthorizedUser(
    playlistId: number,
    decodedUser: JwtPayload,
  ): Promise<void> {
    const playlist: Playlist = await this.getOne(playlistId);
    const user: User = await this.userService.getOne(decodedUser.id);
    if (playlist.userId !== decodedUser.id || user.role == Role.ADMIN) {
      throw new UnauthorizedException('Unauthorized user!');
    }
  }

  async getAll(): Promise<Playlist[]> {
    return await this.prisma.playlist.findMany();
  }

  async getOne(playlistId: number): Promise<Playlist> {
    const playlist: Playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found!');
    }

    return playlist;
  }

  async create(
    playlistData: CreatePlaylistDto,
    user: JwtPayload,
  ): Promise<Playlist> {
    return await this.prisma.playlist.create({
      data: { ...playlistData, userId: user.id },
    });
  }

  async update(
    playlistData: UpdatePlaylistDto,
    playlistId: number,
    decodedUser: JwtPayload,
  ): Promise<Playlist> {
    await this.getOne(playlistId);
    await this.isAuthorizedUser(playlistId, decodedUser);
    return await this.prisma.playlist.update({
      where: { id: playlistId },
      data: { ...playlistData },
    });
  }
}
