import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from 'src/entities/training.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';


@Module({
    imports: [   
        AuthModule,     
        JwtModule,        
        TypeOrmModule.forFeature([Training])
    ],
    controllers: [
        TrainingController
    ],
    providers: [        
        TrainingService,              
    ],
    exports: [
        TrainingService
    ]
})
export class TrainingModule { }
