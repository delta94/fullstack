import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@/modules/user/user.module';
import { LocalStrategy, JwtStrategy } from './strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import {
  RefreshToken,
  RefreshTokenSchema
} from './schemas/refreshToken.schema';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MongooseModule.forFeature([
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema
      }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn:
              configService.get<number>('JWT_TOKEN_EXPIRES_IN_MINUTES') + 'm'
          }
        };
      },
      inject: [ConfigService]
    })
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, AuthService, RefreshTokenService]
})
export class AuthModule {}
