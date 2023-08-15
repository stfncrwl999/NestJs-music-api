import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSingerDto } from './dto/create-singer-dto';
import { Role, Singer, SingerAlbum, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { UpdateSingerDto } from './dto/update-singer-dto';
import { CreateSingerAlbumDto } from '../singer-album/dto/create-singer-album-dto';
import { JwtPayload } from '@app/common';
import { UserService } from '../user/user.service';

@Injectable()
export class SingerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly userService: UserService,
  ) {}

  async isAuthorizedUser(singerId: number, decodedUser: JwtPayload) {
    const singer: Singer = await this.getOne(singerId);
    const user: User = await this.userService.getOne(decodedUser.id);

    if (singer.userId !== decodedUser.id || user.role == Role.ADMIN) {
      throw new UnauthorizedException('Unauthorized user!');
    }
  }

  async getAll(): Promise<Singer[]> {
    return await this.prisma.singer.findMany();
  }

  async getOne(singerId: number): Promise<Singer> {
    const singer: Singer = await this.prisma.singer.findUnique({
      where: { id: singerId },
    });
    if (!singer) {
      throw new NotFoundException('Singer not found!');
    }
    return singer;
  }

  async create(
    singerData: CreateSingerDto,
    file: Express.Multer.File,
    decodedUser: JwtPayload,
  ): Promise<Singer> {
    if (file) {
      await this.uploadService.upload(file.originalname, file.buffer);
    }
    return await this.prisma.singer.create({
      data: {
        ...singerData,
        userId: decodedUser.id,
        photoName: file ? file.originalname : null,
      },
    });
  }

  async update(
    singerData: UpdateSingerDto,
    singerId: number,
    file: Express.Multer.File,
    decodedUser: JwtPayload,
  ): Promise<Singer> {
    await this.isAuthorizedUser(singerId, decodedUser);

    if (file) {
      await this.uploadService.upload(file.originalname, file.buffer);
    }

    return await this.prisma.singer.update({
      where: { id: singerId },
      data: {
        ...singerData,
        photoName: file ? file.originalname : null,
      },
    });
  }

  async createSingerAlbum(
    singerAlbumData: CreateSingerAlbumDto,
    singerId: number,
    file: Express.Multer.File,
    decodedUser: JwtPayload,
  ): Promise<SingerAlbum> {
    await this.getOne(singerId);

    if (file) {
      await this.uploadService.upload(file.originalname, file.buffer);
    }

    return await this.prisma.singerAlbum.create({
      data: {
        ...singerAlbumData,
        userId: decodedUser.id,
        photoName: file ? file.originalname : null,
      },
    });
  }
}
