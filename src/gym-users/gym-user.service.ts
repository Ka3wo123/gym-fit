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

    public createNewUser(gymUser: GymUserDto) {
        const { name, surname, email, password, age } = gymUser;
        const userToSave = new GymUser();
        userToSave.name = name;
        userToSave.surname = surname;
        userToSave.email = email;
        userToSave.password = password;
        userToSave.age = age;

        this._gymUserRepo.create(userToSave);

        return from(this._gymUserRepo.save(userToSave));
    }

    
}
