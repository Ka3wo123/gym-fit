import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GymUsersModule } from './gym-users/gym-user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { TrainingModule } from './trainings/training.module';


const options: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'gym-fitness',
  autoLoadEntities: true,
  synchronize: true
};


@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    GymUsersModule,
    TrainingModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot({
      isGlobal: true
    })],
    providers: [
      { 
        provide: APP_GUARD,
        useClass: RolesGuard
      }
    ]    
})
export class AppModule { }
