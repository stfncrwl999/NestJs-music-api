import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { AwsSesModule } from '../aws-ses/aws-ses.module';

@Module({
  imports: [JwtModule.register({}), CommonModule, AwsSesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
