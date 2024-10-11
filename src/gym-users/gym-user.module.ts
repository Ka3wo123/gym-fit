import { Module } from '@nestjs/common';
import { GymUserController } from './gym-user.controller';
import { GymUserService } from './gym-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymUser } from '../entities/gym-user.entity';
import { UniqueEmailValidator } from 'src/custom-validators/email-unique.validator';

@Module({
  imports: [TypeOrmModule.forFeature([GymUser])],
  controllers: [GymUserController],
  providers: [GymUserService, UniqueEmailValidator],
  exports: [GymUserService]
})
export class GymUsersModule {}
