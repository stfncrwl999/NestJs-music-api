import { ForbiddenException, Injectable, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSignupDto } from './dto/create-signup-dto';
import { Role, User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { CommonService, JwtPayload } from '@app/common';
import { Response } from 'express';
import { CreateProductKeyDto } from './dto/create-product-key-dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateLoginDto } from './dto/create-login-dto';
import { AwsSesService } from '../aws-ses/aws-ses.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly commonService: CommonService,
    private readonly awsSesService: AwsSesService,
  ) {}

  deleteAuthFields(signupData: { password: any; refreshToken: any }): void {
    delete signupData.password;
    delete signupData.refreshToken;
  }

  @Post('product-key')
  async generateProductKey(
    productKeyData: CreateProductKeyDto,
  ): Promise<string> {
    const { email, role } = productKeyData;

    const productKey: string = `${email}-${role}-${this.config.getOrThrow(
      'PRODUCT_KEY_SECRET',
    )}`;

    return await hash(productKey);
  }

  async signup(
    response: Response,
    role: Role,
    signupData: CreateSignupDto,
  ): Promise<User> {
    const { email, password } = signupData;

    const user: User = await this.prisma.user.findUnique({
      where: { email },
    });

    await this.commonService.verifyAdmin(signupData, role);

    if (user) {
      throw new ForbiddenException('Email already taken!');
    }

    const hashedPassword: string = await hash(password);

    const createdUser: User = await this.prisma.user.create({
      data: {
        ...signupData,
        password: hashedPassword,
        email: email.toLowerCase(),
        role,
      },
    });

    const accessToken: string = await this.commonService.generateAccessToken(
      createdUser.id,
      role,
    );

    const refreshToken: string = await this.commonService.generateRefreshToken(
      createdUser.id,
      role,
    );

    await this.commonService.signCookies(response, accessToken, refreshToken);

    this.deleteAuthFields(createdUser);

    response.json(createdUser);

    const subject: string = 'Confirm your email!';
    const link: string = `http://localhost:3000/auth/confirm/${accessToken}`;

    await this.awsSesService.sendEmail(createdUser.email, subject, link);

    return createdUser;
  }

  async confirmEmail(token: string): Promise<User> {
    const decodedUser = this.jwt.decode(token) as JwtPayload;

    if (Date.now() >= decodedUser.exp * 1000) {
      throw new ForbiddenException('Token is expired!');
    }

    const user: User = await this.prisma.user.findUnique({
      where: { id: decodedUser.id },
    });

    if (!user) {
      throw new ForbiddenException('Token is not valid!');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { confirmed: true },
    });

    this.deleteAuthFields(updatedUser);

    return updatedUser;
  }

  async login(response: Response, loginData: CreateLoginDto): Promise<User> {
    const { email, password } = loginData;

    const user: User = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ForbiddenException('Email not found!');
    }

    const validPassword: boolean = await verify(user.password, password);

    if (!validPassword) {
      throw new ForbiddenException('Password is not valid!');
    }

    const accessToken: string = await this.commonService.generateAccessToken(
      user.id,
      user.role,
    );

    const refreshToken: string = await this.commonService.generateRefreshToken(
      user.id,
      user.role,
    );

    await this.commonService.signCookies(response, accessToken, refreshToken);
    await this.commonService.updateRefreshToken(user.id, refreshToken);

    this.deleteAuthFields(user);

    response.json(user);

    return user;
  }
}
