import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TrainingService } from 'src/trainings/training.service';
import { trainingsFixture } from '../fixtures/fixtures';

const mockTrainingService = {
  getTrainings: jest.fn((name?: string, workoutType?: string) => {
    const mockData = trainingsFixture;
    if (name && workoutType) {
      return mockData.filter(
        (t) => t.name.includes(name) && t.workoutType === workoutType
      );
    } else if (name) {
      return mockData.filter((t) => t.name.includes(name));
    } else if (workoutType) {
      return mockData.filter((t) => t.workoutType === workoutType);
    }
    return mockData;
  })
};

const trainingName = trainingsFixture[0].name;
const trainingWorkoutType = trainingsFixture[0].workoutType;

describe('TrainingController (it) - Retrieving', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TrainingService)
      .useValue(mockTrainingService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /trainings (no parameters)', async () => {
    const response = await request(app.getHttpServer())
      .get('/trainings')
      .expect(200);

    expect(response.body.data).toHaveLength(trainingsFixture.length);
  });

  it(`GET /trainings?name=${trainingName} (with name parameter)`, async () => {
    const response = await request(app.getHttpServer())
      .get(`/trainings?name=${trainingName} `)
      .expect(200);

    expect(response.body.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe(trainingName);
  });

  it(`GET /trainings?name=${trainingName}&workoutType=${trainingWorkoutType} (with name and workoutType)`, async () => {
    const response = await request(app.getHttpServer())
      .get(`/trainings?name=${trainingName}&workoutType=${trainingWorkoutType}`)
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe(trainingName);
    expect(response.body.data[0].workoutType).toBe(trainingWorkoutType);
  });

  it(`GET /trainings?workoutType=${trainingWorkoutType} (with workoutType parameter)`, async () => {
    const response = await request(app.getHttpServer())
      .get(`/trainings?workoutType=${trainingWorkoutType}`)
      .expect(200);

    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].workoutType).toBe(trainingWorkoutType);
  });

  afterAll(async () => {
    await app.close();
  });
});
