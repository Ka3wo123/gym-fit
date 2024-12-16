import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { usersFixture } from '../fixtures/fixtures';
import { GymUserService } from 'src/gym-users/gym-user.service';
import { Role } from 'src/types/roles.enum';

describe('UserController (it) - Retrieving', () => {
  let app: INestApplication;

  const mockUserService = {
    getAllUsers: jest.fn((role?: Role) => {
      const mockData = usersFixture;
      if (role) {
        return mockData.filter(t => t.role === role);
      }
      return mockData;  
    })
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideProvider(GymUserService)
      .useValue(mockUserService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200)

    expect(response.body.data).toStrictEqual(usersFixture);
  });

  test.each([
    [      
      Role.USER, usersFixture.filter(user => user.role === 'user'),
      Role.TRAINER, usersFixture.filter(user => user.role === 'trainer')
    ]
  ])(`GET /users?role=%s`, async (role, expectedUsers) => {
    const response = await request(app.getHttpServer())
      .get(`/users?role=${role}`)
      .expect(200)

    expect(response.body.data).toStrictEqual(expectedUsers);
  });

  afterAll(async () => {
    await app.close();
  });
});
