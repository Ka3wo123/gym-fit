import { forwardRef, Module } from '@nestjs/common';
import { GymUserController } from './gym-user.controller';
import { GymUserService } from './gym-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymUser } from 'src/entities/gym-user.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [   
    forwardRef(() => AuthModule),
    JwtModule,    
    TypeOrmModule.forFeature([GymUser])
  ],
  controllers: [GymUserController],
  providers: [GymUserService, AuthService],
  exports: [GymUserService]
})
export class GymUsersModule {}
