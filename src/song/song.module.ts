import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService],
})
export class SongModule {}
