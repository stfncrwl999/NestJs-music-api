import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SingerAlbumService } from './singer-album.service';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role, SingerAlbum, Song } from '@prisma/client';
import { AtGuard } from '../auth/guard/at.guard';
import { SingerAlbumResponse } from './dto/singer-album-response';
import { UpdateSingerAlbumDto } from './dto/update-singer-album-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSongDto } from '../song/dto/create-song-dto';
import { UserDecorator } from '../auth/decorator/user.decorator';
import { JwtPayload } from '@app/common';

@Controller('singer-albums')
export class SingerAlbumController {
  constructor(private readonly singerAlbumService: SingerAlbumService) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  async getAll(): Promise<SingerAlbumResponse[]> {
    return this.singerAlbumService.getAll();
  }

  @Get(':singerAlbumId')
  @UseGuards(AtGuard)
  async getOne(
    @Param('singerAlbumId', new ParseIntPipe()) singerAlbumId: number,
  ): Promise<SingerAlbum> {
    return this.singerAlbumService.getOne(singerAlbumId);
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AtGuard)
  @Put(':singerAlbumId')
  async update(
    @Body() singerAlbumData: UpdateSingerAlbumDto,
    @Param('singerAlbumId', new ParseIntPipe()) singerAlbumId: number,
    @UploadedFile() file: Express.Multer.File,
    @UserDecorator() decodedUser: JwtPayload,
  ): Promise<SingerAlbum> {
    return this.singerAlbumService.update(
      singerAlbumData,
      singerAlbumId,
      file,
      decodedUser,
    );
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AtGuard)
  @Post(':singerAlbumId/songs')
  async createSong(
    @Body() songData: CreateSongDto,
    @Param('singerAlbumId', new ParseIntPipe()) singerAlbumId: number,
    @UploadedFile() file: Express.Multer.File,
    @UserDecorator() decodedUser: JwtPayload,
  ): Promise<Song> {
    return this.singerAlbumService.createSong(
      songData,
      singerAlbumId,
      file,
      decodedUser,
    );
  }
}
