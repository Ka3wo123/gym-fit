import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { TrainingService } from 'src/trainings/training.service';
import { JwtService } from '@nestjs/jwt';
import { TrainingDto } from 'src/dtos/training.dto';
import mockAuthGuard from '../mocks/mock-auth-guard';
import mockRolesGuard from '../mocks/mock-roles-guard';
import { randomUUID, UUID } from 'crypto';
import { WorkoutType } from 'src/types/workout-type.enum';
import { UpdateTrainingDto } from 'src/dtos/updateTraining.dto';

const mockTrainingService = {
  addTraining: jest.fn((email: string, trainingDto: TrainingDto) => ({
    id: randomUUID(),
    ...trainingDto
  })),
  updateTraining: jest.fn((trainingUpdate: UpdateTrainingDto) => ({
    generatedMaps: [],
    raw: [],
    affected: 1
  })),
  deleteTraining: jest.fn((id: UUID) => ({
    raw: [],
    affected: 1
  }))
};

describe('TrainingController (it) - Manipulation', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;
  let trainingId: number;

  const matchUUID =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TrainingService)
      .useValue(mockTrainingService)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalGuards(new mockAuthGuard(), new mockRolesGuard());

    await app.init();

    jwtService = app.get(JwtService);
    token = jwtService.sign({ email: 'trainer@test.com', role: 'trainer' });
  });

  it('POST /trainings', async () => {
    const newTraining: TrainingDto = {
      name: 'Cardio Pro',
      dateStart: new Date(),
      workoutType: WorkoutType.CARDIO,

    };

    const response = await request(app.getHttpServer())
      .post('/trainings?email=trainer@test.com')
      .set('Authorization', `Bearer ${token}`)
      .send(newTraining)
      .expect(201);

    trainingId = response.body.data.id;

    expect(response.body.data.id).toMatch(matchUUID);
    expect(response.body.data.name).toBe(newTraining.name);
    expect(response.body.data.dateStart).toBe(newTraining.dateStart.toISOString());
    expect(response.body.data.workoutType).toBe(newTraining.workoutType);
    expect(response.body.data.capacity).toBe(newTraining.capacity);
    expect(response.body.data.freeSpaces).toBe(newTraining.freeSpaces);
  });

  it('POST /trainings - throw Forbidden', async () => {
    const newTraining: TrainingDto = {
      name: 'Cardio Pro',
      dateStart: new Date(),
      workoutType: WorkoutType.CARDIO,

    };
    await request(app.getHttpServer())
      .post('/trainings?email=trainer@test.com')
      .set('Authorization', `Bearer wrong-token`)
      .send(newTraining)
      .expect(403);
  });

  it(`PUT /trainings/${trainingId}`, async () => {
    const toUpdate: UpdateTrainingDto = {
      name: 'Cardio Pro 2',
      workoutType: WorkoutType.BODYBUILDING,
    };

    await request(app.getHttpServer())
      .put(`/trainings/${trainingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(toUpdate)
      .expect(200);
  });

  it(`DELETE /trainings/${trainingId}`, async () => {

    await request(app.getHttpServer())
      .delete(`/trainings/${trainingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
