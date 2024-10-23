import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { GymUserDto } from 'src/dtos/gym-user.dto';
import { GymUser } from 'src/entities/gym-user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GymUserService {
    constructor(@InjectRepository(GymUser) private readonly _gymUserRepo: Repository<GymUser>) { }

    public getAllUsers(): Observable<GymUserDto[]> {
        return from(this._gymUserRepo.find()).pipe(
            map((users: GymUser[]) => users.map(user => this.toDto(user)))
        );
    }

    public async findByEmail(email: string): Promise<GymUserDto | null> {
        const user = await this._gymUserRepo.findOneBy({ email });

        return user ? this.toDto(user) : null;
        
    }

    private toDto(user: GymUser): GymUserDto {
        return {
            name: user.name,
            surname: user.surname,
            email: user.email,
            workoutType: user.workoutType,
            age: user.age
        }

    }

   

    
}
