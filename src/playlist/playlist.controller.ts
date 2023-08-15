import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist-dto';
import { Playlist, Role } from '@prisma/client';
import { AtGuard } from '../auth/guard/at.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UpdatePlaylistDto } from './dto/update-playlist-dto';
import { UserDecorator } from '../auth/decorator/user.decorator';
import { JwtPayload } from '@app/common';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAll(): Promise<Playlist[]> {
    return this.playlistService.getAll();
  }

  @UseGuards(AtGuard)
  @Get(':songId')
  async getOne(
    @Param('songId', new ParseIntPipe()) songId: number,
  ): Promise<Playlist> {
    return this.playlistService.getOne(songId);
  }

  @UseGuards(AtGuard)
  @Post()
  async create(
    @Body() playlistData: CreatePlaylistDto,
    @UserDecorator() decodedUser: JwtPayload,
  ): Promise<Playlist> {
    return this.playlistService.create(playlistData, decodedUser);
  }

  @UseGuards(AtGuard)
  @Put(':playlistId')
  async update(
    @Body() playlistData: UpdatePlaylistDto,
    @Param('playlistId', new ParseIntPipe()) playlistId: number,
    @UserDecorator() decodedUser: JwtPayload,
  ): Promise<Playlist> {
    return this.playlistService.update(playlistData, playlistId, decodedUser);
  }
}
