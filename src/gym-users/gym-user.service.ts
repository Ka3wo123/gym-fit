import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { GymUserDto } from 'src/dtos/gym-user.dto';
import { GymUser } from 'src/entities/gym-user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GymUserService {
    constructor(@InjectRepository(GymUser) private readonly _gymUserRepo: Repository<GymUser>) { }

    public getAllUsers(): Observable<GymUserDto[]> {
        return from(this._gymUserRepo.find());
    }

    public findByEmail(email: string): Promise<GymUserDto> {
        return this._gymUserRepo.findOneBy({ email });
    }

   

    
}
