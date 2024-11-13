import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { from, map, Observable } from 'rxjs';
import { GymUserDto } from 'src/dtos/gym-user.dto';
import { GymUser } from 'src/entities/gym-user.entity';
import { Training } from 'src/entities/training.entity';
import { AlreadyAssignException } from 'src/exceptions/CustomExceptions';
import { Repository } from 'typeorm';

@Injectable()
export class GymUserService {
    constructor(
        @InjectRepository(GymUser) private readonly _gymUserRepo: Repository<GymUser>,
        @InjectRepository(Training) private readonly _trainingRepo: Repository<Training>
    ) { }

    public getAllUsers(): Observable<GymUserDto[]> {
        return from(this._gymUserRepo.find()).pipe(
            map((users: GymUser[]) => users.map(user => this.toDto(user)))
        );
    }

    public async findByEmail(email: string): Promise<GymUserDto | null> {
        const user = await this._gymUserRepo.findOneBy({ email });

        return user ? this.toDto(user) : null;

    }

    public async assignUserToTraining(userId: UUID, trainingId: UUID): Promise<Training> {
        const user = await this._gymUserRepo.findOneBy({ id: userId });

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

        training.users.push(user);

        await this._trainingRepo.save(training);

        return training;
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
