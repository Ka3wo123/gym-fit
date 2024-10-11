import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymUser } from 'src/entities/gym-user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([GymUser]),
    JwtModule.register({
      secret: 'sld34fdioFR9vc30pppac009',
      signOptions: {
        algorithm: 'HS512',
        expiresIn: '1d'
      }
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    })   
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
