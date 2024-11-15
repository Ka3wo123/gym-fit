import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { TrainingService } from './training.service';
import { WorkoutType } from 'src/types/workout-type.enum';
import { Training } from 'src/entities/training.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/types/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { TrainingDto } from 'src/dtos/training.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateTrainingDto } from 'src/dtos/updateTraining.dto';
import { Validate } from 'class-validator';

@ApiTags('Trainings')
@Controller('trainings')
export class TrainingController {
    constructor(private readonly _trainingService: TrainingService) { }


    @Get()
    public async getTrainings(
        @Query('name') name?: string,
        @Query('workoutType') workoutType?: WorkoutType
    ): Promise<{ status: number, data: TrainingDto[] }> {
        const trainings = await this._trainingService.getTrainings(name, workoutType);
        return {
            status: 200,
            data: trainings
        }
    }

    @ApiOperation({
        summary: 'Add new training',
        description: 'This endpoint can only be accessed by users with the Trainer role.',
    })
    @ApiBearerAuth('JWT')
    @Post()
    @Roles(Role.TRAINER)
    @UseGuards(AuthGuard, RolesGuard)
    public async addTraining(@Body(new ValidationPipe) training: TrainingDto): Promise<{ status: number, data: TrainingDto }> {
        const data = await this._trainingService.addTraining(training);
        return {
            status: 201,
            data: data
        }
    }

    @Put(':trainingId')
    @Roles(Role.ADMIN, Role.TRAINER)
    @UseGuards(AuthGuard, RolesGuard)
    public async updateTraining(@Param('trainingId') id: UUID, @Body() trainingDto: UpdateTrainingDto): Promise<{ status: number, data: UpdateResult }> {
        const result = await this._trainingService.updateTraining(id, trainingDto);

        return {
            status: 200,
            data: result
        }
    }

    @Delete(':trainingId')
    @Roles(Role.ADMIN, Role.TRAINER)
    @UseGuards(AuthGuard, RolesGuard)
    public async deleteTraining(@Param('trainingId') id: UUID): Promise<{ status: number, data: DeleteResult }> {
        const result = await this._trainingService.deleteTraining(id);

        return {
            status: 204,
            data: result
        }
    }
}
