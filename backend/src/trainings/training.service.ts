import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Training } from 'src/entities/training.entity';
import { WorkoutType } from 'src/types/workout-type.enum';
import { TrainingDto } from 'src/dtos/training.dto';
import { UUID } from 'crypto';
import { UpdateTrainingDto } from 'src/dtos/updateTraining.dto';

@Injectable()
export class TrainingService {
    constructor(
        @InjectRepository(Training) private readonly _trainingRepo: Repository<Training>
    ) { }

    public getTrainings(name?: string, workoutType?: WorkoutType): Promise<Training[]> {
        const queryBuilder = this._trainingRepo.createQueryBuilder('training');

        if (name) {
            queryBuilder.andWhere('training.name LIKE :name', { name: `%${name}%` });
        }

        if (workoutType) {
            queryBuilder.andWhere('training.workoutType LIKE :workoutType', { workoutType: `%${workoutType}%` });
        }

        return queryBuilder.getMany();
    }


    public async addTraining(createTrainingDto: TrainingDto): Promise<Training> {
        const training = this._trainingRepo.create(createTrainingDto);

        return await this._trainingRepo.save(training);
    }

    public async updateTraining(id: UUID, updateTrainingDto: UpdateTrainingDto): Promise<UpdateResult> {
        const training = await this._trainingRepo.findOne({ where: {
            id: id
        }});

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
