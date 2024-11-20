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

    public getAllUsers(role?: Role): Observable<GymUserDto[]> {
        const query = this._gymUserRepo.createQueryBuilder('gym_user');

        if (role) {
            query.where('gym_user.role LIKE :role', { role: role })
        }

        return from(query.getMany()).pipe(
            map((users: GymUser[]) => users.map(user => this.toDto(user)))
        );
    }

    public async findByEmail(email: string): Promise<GymUserDto | null> {
        const user = await this._gymUserRepo.findOneBy({ email });

        return user ? this.toDto(user) : null;
    }

    public async assignUserToTraining(email: string, trainingId: UUID): Promise<Training> {
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

        if (training.capacity && usersCount[0].count > training.capacity) {
            throw new MaxCapacityException('Full capacity for this training');
        }

        training.users.push(user);

        await this._trainingRepo.save(training);

        return training;
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
}
