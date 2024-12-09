import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { trainingsFixture, usersFixture } from '../../test/fixtures/fixtures';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { WorkoutType } from 'src/types/workout-type.enum';
import { TrainingDto } from 'src/dtos/training.dto';
import { randomUUID } from 'crypto';
import { UpdateTrainingDto } from 'src/dtos/updateTraining.dto';

describe('TrainingController', () => {
    let controller: TrainingController;
    let mockTrainingService: {
        getTrainings: jest.Mock,
        addTraining: jest.Mock,
        updateTraining: jest.Mock
    };

    beforeEach(async () => {
        const mockAuthService = {
            validateUser: jest.fn(),
        };

        mockTrainingService = {
            getTrainings: jest.fn(),
            addTraining: jest.fn(),
            updateTraining: jest.fn()
        };

        const mockJwtService = {
            sign: jest.fn(),
            verify: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TrainingController],
            providers: [
                TrainingService,
                {
                    provide: AuthService,
                    useValue: mockAuthService
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService
                },
                {
                    provide: Reflector,
                    useValue: {
                        get: jest.fn(),
                        getAll: jest.fn()
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn()
                    },
                },
            ],
        })
            .overrideProvider(TrainingService)
            .useValue(mockTrainingService)
            .compile();

        controller = module.get<TrainingController>(TrainingController);
    });

    it('should get all trainings when no arguments are provided', async () => {
        const spy = jest.spyOn(mockTrainingService, 'getTrainings').mockResolvedValue(trainingsFixture);

        const trainings = await controller.getTrainings();

        expect(spy).toHaveBeenCalledWith(undefined, undefined);
        expect(trainings.data.length).toBe(trainingsFixture.length);
    });

    it('should get trainings filtered by name', async () => {
        const name = trainingsFixture[0].name;
        const spy = jest.spyOn(mockTrainingService, 'getTrainings').mockResolvedValue(
            trainingsFixture.filter(t => t.name.includes(name))
        );

        const trainings = await controller.getTrainings(name, undefined);

        expect(spy).toHaveBeenCalledWith(name, undefined);
        expect(trainings.data.every(training => training.name.includes(name))).toBe(true);
    });

    it('should get trainings filtered by workoutType', async () => {
        const workoutType = WorkoutType.CALISTHENICS;
        const spy = jest.spyOn(mockTrainingService, 'getTrainings').mockResolvedValue(
            trainingsFixture.filter(t => t.workoutType === workoutType)
        );

        const trainings = await controller.getTrainings(undefined, workoutType);

        expect(spy).toHaveBeenCalledWith(undefined, workoutType);
        expect(trainings.data.every(training => training.workoutType === workoutType)).toBe(true);
    });

    it('should get trainings filtered by both name and workoutType', async () => {
        const spy = jest.spyOn(mockTrainingService, 'getTrainings').mockResolvedValue(
            trainingsFixture.filter(t => t.name.includes(trainingsFixture[0].name) && t.workoutType === WorkoutType.BODYBUILDING)
        );
        const name = trainingsFixture[0].name;
        const workoutType = WorkoutType.BODYBUILDING;

        const trainings = await controller.getTrainings(name, workoutType);

        expect(spy).toHaveBeenCalledWith(name, workoutType);
        expect(trainings.data.every(training => training.name.includes(name) && training.workoutType === workoutType)).toBe(true);
    });

    it('should add training and assign trainer to it', async () => {
        const id = randomUUID();
        const name = 'Training';
        const dateStart = new Date();
        const workoutType = WorkoutType.CALISTHENICS;
        const trainer = usersFixture.find(u => u.role === 'trainer');
        const training: TrainingDto = {
            name: name,
            dateStart: dateStart,
            workoutType: workoutType
        };
        const spy = jest.spyOn(mockTrainingService, 'addTraining').mockReturnValue({
            id: id,
            name: name,
            dateStart: dateStart,
            workoutType: workoutType
        });

        const result = await controller.addTraining(trainer.email, training);

        expect(spy).toHaveBeenCalledWith(trainer.email, training);
        expect(result.data.name).toEqual(name);
    });

    it('should update a training when valid data is provided', async () => {
        const spy = jest.spyOn(mockTrainingService, 'updateTraining').mockResolvedValue({
                generatedMaps: [],
                raw: [],
                affected: 1            
        })
        const training = trainingsFixture[0];
        const updateTrainingDto: UpdateTrainingDto = {
            name: 'Updated Training',
            dateStart: new Date(),
            workoutType: WorkoutType.BODYBUILDING,
        };

        const result = await controller.updateTraining(training.id, updateTrainingDto);

        expect(spy).toHaveBeenCalledWith(training.id, updateTrainingDto);
        expect(result.data.affected).toEqual(1);
    });
});
