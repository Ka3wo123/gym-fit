import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Training } from 'src/entities/training.entity';
import { WorkoutType } from 'src/types/workout-type.enum';
import { TrainingDto } from 'src/dtos/training.dto';
import { UUID } from 'crypto';
import { UpdateTrainingDto } from 'src/dtos/updateTraining.dto';
import { plainToClass } from 'class-transformer';
import { GymUserService } from 'src/gym-users/gym-user.service';

@Injectable()
export class TrainingService {
    constructor(
        @InjectRepository(Training) private readonly _trainingRepo: Repository<Training>,
        private readonly _userService: GymUserService
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

        return Promise.all(
            trainings.map(async (training) => {
                const dto = new TrainingDto();
                dto.id = training.id;
                dto.name = training.name;
                dto.dateStart = training.dateStart;
                dto.workoutType = training.workoutType;
                dto.capacity = training.capacity;
    
                const result = await this._trainingRepo.query(
                    `SELECT COUNT(*) as count FROM user_trainings WHERE training_id = ?`,
                    [training.id]
                );
    
                const count = result[0]?.count || 0;
                dto.freeSpaces = training.capacity ? training.capacity - count : null;
    
                return dto;
            })
        );
    }

    public async addTraining(createTrainingDto: TrainingDto): Promise<TrainingDto> {
        const training = this._trainingRepo.create(createTrainingDto);
        const savedTraining = await this._trainingRepo.save(training);

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
