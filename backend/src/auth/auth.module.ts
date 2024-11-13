import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymUser } from 'src/entities/gym-user.entity';
import { PassportModule } from '@nestjs/passport';
import { UniqueEmailValidator } from 'src/custom-validators/email-unique.validator';
import { GymUsersModule } from 'src/gym-users/gym-user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => GymUsersModule),
    TypeOrmModule.forFeature([GymUser]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          algorithm: 'HS512',
          expiresIn: '1d'
        }
      }),
      inject: [
        ConfigService
      ]
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    })
  ],
  providers: [
    AuthService,
    UniqueEmailValidator
  ],
  controllers: [
    AuthController
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule { }
