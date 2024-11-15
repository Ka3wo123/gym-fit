import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGymUserDto } from 'src/dtos/auth-gym-user.dto';
import { RegisterGymUserDto } from 'src/dtos/register-gym-user.dto';
import { GymUser } from 'src/entities/gym-user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/types/roles.enum';
import { GymUserDto } from 'src/dtos/gym-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(GymUser) private readonly _gymUserRepo: Repository<GymUser>,
        private readonly _jwt: JwtService,
        private readonly _configService: ConfigService
    ) { }


    public async authenticateUser(gymUser: AuthGymUserDto) {
        const { email, password } = gymUser;
        const user = await this._gymUserRepo.findOneBy({ email });

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);


        if (isPasswordMatch) {
            const jwtToken = await this._jwt.signAsync({
                email: user.email,
                role: user.role
            });

            const refreshToken = await this._jwt.signAsync({
                email: user.email,
                role: user.role
            }, {
                secret: this._configService.get<string>('JWT_REFRESH_SECRET_KEY'),
                expiresIn: '30d'
            })

            user.refreshToken = refreshToken;
            await this._gymUserRepo.save(user);
            return { token: jwtToken, refreshToken };
        } else {
            throw new UnauthorizedException("Invalid credentials");
        }

    }

    public async createNewUser(gymUser: RegisterGymUserDto): Promise<GymUserDto> {
        const { name, surname, email, password, age, workoutType, role } = gymUser;
        const userToSave = new RegisterGymUserDto();
        const hashedPassword = await bcrypt.hash(password, 12);

        userToSave.name = name;
        userToSave.surname = surname;
        userToSave.email = email;
        userToSave.password = hashedPassword;
        userToSave.age = age;
        userToSave.workoutType = workoutType;
        userToSave.role = role || Role.USER;

        this._gymUserRepo.create(userToSave);

        return this._gymUserRepo.save(userToSave);
    }


    public async refreshAccessToken(refreshToken: string) {
        this.validateToken(refreshToken);

        const user = await this._gymUserRepo.findOneBy({ refreshToken });

        if (!user) {
            throw new ForbiddenException('Invalid refresh token');
        }

        const newAccessToken = await this._jwt.signAsync(
            {
                email: user.email,
                role: user.role
            },
            {
                secret: this._configService.get<string>('JWT_SECRET_KEY'),
                expiresIn: '1d'
            }
        );

        return { accessToken: newAccessToken };
    }

    public validateToken(token: string) {
        return this._jwt.verify(token, {
            secret: this._configService.get<string>('JWT_SECRET_KEY')
        })
    }


}
