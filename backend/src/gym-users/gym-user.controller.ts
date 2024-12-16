import { Controller, Delete, Get, HttpException, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { GymUserService } from './gym-user.service';
import { GymUserDto } from 'src/dtos/gym-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UUID } from 'crypto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/types/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TrainingDto } from 'src/dtos/training.dto';

@ApiTags('Users')
@Controller('users')
export class GymUserController {
    constructor(private readonly _gymUserService: GymUserService) { }

    @ApiOperation({
        summary: 'Get all gym users',
        description: 'This endpoint can only be accessed by users with the Admin, Trainer or User role.',
    })
    @Get()
    public async getAllUsers(@Query('role') role?: Role): Promise<{ statusCode: number, data: GymUserDto[] }> {
        const result = await this._gymUserService.getAllUsers(role);

        return {
            statusCode: HttpStatus.OK,
            data: result
        }
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

    @ApiBearerAuth('JWT')
    @Get('/:email/training/:trainingId')
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    public async assignToTraining(@Param('email') email: string, @Param('trainingId') trainingId: UUID): Promise<{ training: TrainingDto, users: GymUserDto[] }> {
        const result = await this._gymUserService.assignUserToTraining(email, trainingId);

        return {
            training: result.training,
            users: result.users
        }
    }

    @ApiBearerAuth('JWT')
    @Get('/:email/trainings')
    @Roles(Role.ADMIN, Role.USER, Role.TRAINER)
    @UseGuards(AuthGuard, RolesGuard)
    public async getTrainingsForUser(@Param('email') email: string) {
        return this._gymUserService.getTrainingsForUser(email);
    }

    @Delete('/:email/training/:trainingId')
    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, RolesGuard)
    public async deleteTrainingForUser(@Param('email') email: string, @Param('trainingId') trainingId: UUID): Promise<{ status: number }> {
        await this._gymUserService.deleteTrainingForUser(email, trainingId);

        return {
            status: HttpStatus.NO_CONTENT
        }
    }
}
