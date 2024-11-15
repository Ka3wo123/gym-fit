import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Training } from 'src/entities/training.entity';
import { WorkoutType } from 'src/types/workout-type.enum';
import { TrainingDto } from 'src/dtos/training.dto';
import { UUID } from 'crypto';
import { UpdateTrainingDto } from 'src/dtos/updateTraining.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TrainingService {
    constructor(
        @InjectRepository(Training) private readonly _trainingRepo: Repository<Training>
    ) { }

    public async getTrainings(name?: string, workoutType?: WorkoutType): Promise<TrainingDto[]> {
        const queryBuilder = this._trainingRepo.createQueryBuilder('training');

        if (name) {
            queryBuilder.andWhere('training.name LIKE :name', { name: `%${name}%` });
        }

        if (workoutType) {
            queryBuilder.andWhere('training.workoutType LIKE :workoutType', { workoutType: `%${workoutType}%` });
        }

        const trainings = await queryBuilder.getMany();

        return trainings.map(training => {
            const dto = new TrainingDto();    
            dto.id = training.id;        
            dto.name = training.name;
            dto.dateStart = training.dateStart;
            dto.workoutType = training.workoutType;
            dto.capacity = training.capacity;            
            return dto;
        });
    }

    public async addTraining(createTrainingDto: TrainingDto): Promise<TrainingDto> {
        const training = this._trainingRepo.create(createTrainingDto);
        const savedTraining = await this._trainingRepo.save(training);

        // Map the entity to DTO and return
        return plainToClass(TrainingDto, savedTraining);
    }

    public async updateTraining(id: UUID, updateTrainingDto: UpdateTrainingDto): Promise<UpdateResult> {
        const training = await this._trainingRepo.findOne({ where: { id } });

        if (!training) {
            throw new NotFoundException('Training not found');
        }

        Object.assign(training, updateTrainingDto);
        return await this._trainingRepo.update(id, training);
    }

    public async deleteTraining(id: UUID): Promise<DeleteResult> {
        return await this._trainingRepo.delete(id);
    }
}
