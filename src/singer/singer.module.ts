import { Module } from '@nestjs/common';
import { SingerService } from './singer.service';
import { SingerController } from './singer.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [SingerController],
  providers: [SingerService],
})
export class SingerModule {}
