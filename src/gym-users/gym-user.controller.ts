import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Res, ValidationPipe } from '@nestjs/common';
import { GymUserService } from './gym-user.service';
import { GymUser } from 'src/entities/gym-user.entity';
import { lastValueFrom, Observable } from 'rxjs';
import { GymUserDto } from 'src/dtos/gym-user.dto';

@Controller('users')
export class GymUserController {
    constructor(private readonly _gymUserService: GymUserService) { }

    @Get()
    public async getAllUsers(){        
        const users = await lastValueFrom(this._gymUserService.getAllUsers());

        if (!users || users.length === 0) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No users found',
            }, HttpStatus.NOT_FOUND);
        }

        return {
            statusCode: 200,            
            data: users,
        };
    }

    @Get('/:email')
    public async getByEmail(@Param('email') email: string) {
        const user = await this._gymUserService.findByEmail(email);

        if (!user) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: `User with email ${email} not found`,
            }, HttpStatus.NOT_FOUND);
        }

        return {
            statusCode: 200,
            data: user,
        };
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public createNewUser(@Body(ValidationPipe) gymUser: GymUserDto) {
        this._gymUserService.createNewUser(gymUser);

    }
}
