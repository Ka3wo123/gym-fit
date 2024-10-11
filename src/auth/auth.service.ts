import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { AuthGymUserDto } from 'src/dtos/auth-gym-user.dto';
import { RegisterGymUserDto } from 'src/dtos/register-gym-user.dto';
import { GymUser } from 'src/entities/gym-user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(GymUser) private readonly _gymUserRepo: Repository<GymUser>,
        private readonly _jwt: JwtService
    ) { }


    public async authenticateUser(gymUser: AuthGymUserDto) {
        const { email, password } = gymUser;
        const user = await this._gymUserRepo.findOneBy({ email });

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);


        if (isPasswordMatch) {
            const jwtToken = await this._jwt.signAsync({ email });
            const refreshToken = uuid();

            user.refreshToken = refreshToken;
            await this._gymUserRepo.save(user);
            return { token: jwtToken, refreshToken };
        } else {
            throw new UnauthorizedException("Invalid credentials");
        }

    }

    public async createNewUser(gymUser: RegisterGymUserDto) {
        const { name, surname, email, password, age } = gymUser;
        const userToSave = new RegisterGymUserDto();
        const hashedPassword = await bcrypt.hash(password, 12);

        userToSave.name = name;
        userToSave.surname = surname;
        userToSave.email = email;
        userToSave.password = hashedPassword
        userToSave.age = age;

        this._gymUserRepo.create(userToSave);

        return from(this._gymUserRepo.save(userToSave));
    }
}
