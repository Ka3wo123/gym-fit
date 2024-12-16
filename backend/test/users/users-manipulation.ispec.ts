import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { trainingsFixture, usersFixture } from '../fixtures/fixtures';
import { GymUserService } from 'src/gym-users/gym-user.service';
import { Role } from 'src/types/roles.enum';
import mockAuthGuard from '../mocks/mock-auth-guard';
import mockRolesGuard from '../mocks/mock-roles-guard';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'crypto';

describe('UserController (it) - Manipulation', () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let token: string;
    const trainingId = trainingsFixture[0].id;
    const email = usersFixture.find(u => u.role !== "trainer").email;
    const role = Role.USER;

    const mockUserService = {

        getAllUsers: jest.fn((role?: Role) => {
            const mockData = usersFixture;
            if (role) {
                return mockData.filter(t => t.role === role);
            }
            return mockData;
        }),
        assignUserToTraining: jest.fn(async (email: string, trainingId: UUID) => {
            return {
                training: {
                    id: trainingsFixture[0].id,
                    name: trainingsFixture[0].name,
                    dateStart: trainingsFixture[0].dateStart,
                    workoutType: trainingsFixture[0].workoutType,
                    capacity: trainingsFixture[0].capacity,
                },
                users: [
                    {
                        id: usersFixture[0].id,
                        email: usersFixture[0].email,
                        name: usersFixture[0].name,
                        surname: usersFixture[0].surname,
                    }
                ]
            };
        })
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).overrideProvider(GymUserService)
            .useValue(mockUserService)
            .compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalGuards(new mockAuthGuard(), new mockRolesGuard());

        await app.init();

        jwtService = app.get(JwtService);
        token = jwtService.sign({ email: email, role: role });
    });


    it(`GET /users/${email}/training/${trainingId}`, async () => {
        const response = await request(app.getHttpServer())
            .get(`/users/${email}/training/${trainingId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body.training.id).toBe(trainingId);
        expect(response.body.users[0].email).toBe(email);
    });
});
