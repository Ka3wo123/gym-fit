import { Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { GymUserService } from './gym-user.service';
import { Observable } from 'rxjs';
import { GymUserDto } from 'src/dtos/gym-user.dto';
import { map, catchError } from 'rxjs/operators';
import { AuthGuard } from 'src/guards/auth.guard';
import { UUID } from 'crypto';
import { Training } from 'src/entities/training.entity';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/types/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class GymUserController {
    constructor(private readonly _gymUserService: GymUserService) { }

    @ApiOperation({
        summary: 'Get all gym users',
        description: 'This endpoint can only be accessed by users with the Admin, Trainer or User role.',
    })
    @ApiBearerAuth('JWT')
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

    @ApiOperation({
        summary: 'Get user by email',
        description: 'This endpoint can only be accessed by users with the Admin, Trainer or User role.',
    })
    @ApiBearerAuth('JWT')
    @Get('/:email')
    @Roles(Role.ADMIN, Role.TRAINER, Role.USER)
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

    @Post('/:userId/training/:trainingId')
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    public async assignToTraining(@Param('userId') userId: UUID, @Param('trainingId') trainingId: UUID): Promise<Training> {
        return this._gymUserService.assignUserToTraining(userId, trainingId);
    }
}
