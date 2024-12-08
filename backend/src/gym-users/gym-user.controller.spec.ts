import { Test, TestingModule } from '@nestjs/testing';
import { GymUserController } from './gym-user.controller';
import { GymUserService } from './gym-user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { trainingsFixture, usersFixture } from '../../test/fixtures/fixtures';
import { randomUUID } from 'crypto';
import { Role } from 'src/types/roles.enum';

describe('GymUserController', () => {
    let controller: GymUserController;

    beforeEach(async () => {
        const mockAuthService = {
            validateUser: jest.fn(),
        };

        const mockGymUserService = {            
            getAllUsers: jest.fn(),
            assignUserToTraining: jest.fn()
        };

        const mockJwtService = {
            sign: jest.fn(),
            verify: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [GymUserController],
            providers: [
                GymUserService,

                {
                    provide: AuthService,
                    useValue: mockAuthService
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService
                },                
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn()
                    },
                },
            ],
        })
            .overrideProvider(GymUserService)
            .useValue(mockGymUserService)
            .compile();

        controller = module.get<GymUserController>(GymUserController);
    });

    it('should get all users', async () => {
        const spy = jest.spyOn(controller['_gymUserService'], 'getAllUsers').mockResolvedValue(usersFixture);

        const users = await controller.getAllUsers();

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(undefined);
        expect(users.data.length).toBe(usersFixture.length);
        expect(users.data).toBe(usersFixture);
    });

    test.each(
        [
            [Role.USER, usersFixture.filter(user => user.role === 'user')],
            [Role.TRAINER, usersFixture.filter(user => user.role === 'trainer')]
        ]
    )('should get users by role %s', async (role) => {
        const spy = jest.spyOn(controller['_gymUserService'], 'getAllUsers').mockResolvedValue(usersFixture);
        
        const users = await controller.getAllUsers(role);

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(role);
        expect(users.data.length).toBe(usersFixture.length);
        expect(users.data).toBe(usersFixture);
    });

    it('should assign user to training', async () => {
        const user = usersFixture[0];
        const training = trainingsFixture[0];
        const mockResult = {
            training: training,
            users: [user]
        };

        jest.spyOn(controller['_gymUserService'], 'assignUserToTraining').mockResolvedValue(mockResult);

        const result = await controller.assignToTraining(user.email, training.id);

        expect(result.users).toEqual(expect.arrayContaining([user]));
        expect(result.training).toBe(training);
    });
});
