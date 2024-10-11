import { Module } from '@nestjs/common';
import { GymUserController } from './gym-user.controller';
import { GymUserService } from './gym-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymUser } from 'src/entities/gym-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GymUser])
  ],
  controllers: [GymUserController],
  providers: [GymUserService],
  exports: [GymUserService]
})
export class GymUsersModule {}
