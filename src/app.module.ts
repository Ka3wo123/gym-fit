import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GymUsersModule } from './gym-users/gym-user.module';
import { AuthModule } from './auth/auth.module';


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
  imports: [TypeOrmModule.forRoot(options), GymUsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
