import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { from, map, Observable } from 'rxjs';
import { GymUserDto } from 'src/dtos/gym-user.dto';
import { TrainingDto } from 'src/dtos/training.dto';
import { GymUser } from 'src/entities/gym-user.entity';
import { Training } from 'src/entities/training.entity';
import { AlreadyAssignException, MaxCapacityException } from 'src/exceptions/CustomExceptions';
import { Role } from 'src/types/roles.enum';
import { Repository } from 'typeorm';

@Injectable()
export class GymUserService {
    constructor(
        @InjectRepository(GymUser) private readonly _gymUserRepo: Repository<GymUser>,
        @InjectRepository(Training) private readonly _trainingRepo: Repository<Training>
    ) { }

    public async getAllUsers(role?: Role): Promise<GymUserDto[]> {
        const query = this._gymUserRepo.createQueryBuilder('gym_user');

        if (role) {
            query.where('gym_user.role LIKE :role', { role: role })
        }

        const result = await query.getMany()
        return result.flatMap(user => this.toDto(user));
    }

    public async findByEmail(email: string): Promise<GymUserDto | null> {
        const user = await this._gymUserRepo.findOneBy({ email });

        return user ? this.toDto(user) : null;
    }

    public async assignUserToTraining(email: string, trainingId: UUID): Promise<{ training: TrainingDto, users: GymUserDto[] }> {
        const user = await this._gymUserRepo.findOneBy({ email: email });
    
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        const training = await this._trainingRepo.findOne({
            where: {
                id: trainingId
            },
            relations: ['users']
        });
    
        if (!training) {
            throw new NotFoundException('Training not found');
        }
    
        if (training.users.some(trainingUser => trainingUser.id === user.id)) {
            throw new AlreadyAssignException('User is already assigned to this training');
        }
    
        const usersCount = await this._trainingRepo.query(
            `SELECT COUNT(*) as count FROM user_trainings WHERE training_id = ?`,
            [trainingId]
        );
    
        if (training.capacity && usersCount[0].count >= training.capacity) {
            throw new MaxCapacityException('Full capacity for this training');
        }
    
        training.users.push(user);
    
        await this._trainingRepo.save(training);
                    
        const usersDto = training.users.map(user => this.toDto(user));
        const trainingDto = this.toTrainingDto(training);
    
        return {
            training: trainingDto,
            users: usersDto
        };
    }
    

    public async getTrainingsForUser(email: string): Promise<Training[]> {
        const user = await this._gymUserRepo.findOne({
            where: { email: email },
            relations: ['trainings']
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user.trainings;
    }

    public async deleteTrainingForUser(email: string, trainingId: UUID): Promise<void> {
        const user = await this._gymUserRepo.findOne({
            where: { email: email },
            relations: ['trainings']
        });
    
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        const training = user.trainings.find(t => t.id === trainingId);
        if (!training) {
            throw new NotFoundException('Training not associated with this user');
        }
 
        await this._gymUserRepo.createQueryBuilder()
            .relation(GymUser, 'trainings')
            .of(user) 
            .remove(training);    
    }

    private toDto(user: GymUser): GymUserDto {
        return {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            workoutType: user.workoutType,
            age: user.age,
            role: user.role
        }
    }

    private toTrainingDto(training: Training): TrainingDto {
        return {
            id: training.id,
            name: training.name,
            capacity: training.capacity,
            dateStart: training.dateStart          
        }
    }
}
