import { Controller, Get, HttpException, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { GymUserService } from './gym-user.service';
import { Observable } from 'rxjs';
import { GymUserDto } from 'src/dtos/gym-user.dto';
import { map, catchError } from 'rxjs/operators';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('users')
export class GymUserController {
    constructor(private readonly _gymUserService: GymUserService) { }

    @Get()
    public getAllUsers(): Observable<{ statusCode: number, data: GymUserDto[] }> {
        return this._gymUserService.getAllUsers().pipe(
            map(users => ({
                statusCode: 200,
                data: users,
            })),
            catchError(() => {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'No users found',
                }, HttpStatus.NOT_FOUND);
            })
        );
    }

    @Get('/:email')
    @UseGuards(AuthGuard)
    public async getByEmail(@Param('email') email: string): Promise<{ statusCode: number, data: GymUserDto }> {
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
}
