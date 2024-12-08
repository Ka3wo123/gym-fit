import { WorkoutType } from '../../src/types/workout-type.enum';
import { Role } from '../../src/types/roles.enum';
import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto';

export const usersFixture = [
    {
        id: randomUUID(),
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        workoutType: WorkoutType.BODYBUILDING,
        email: faker.internet.email(),
        role: Role.USER
    },
    {
        id: randomUUID(),
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        workoutType: WorkoutType.CALISTHENICS,
        email: faker.internet.email(),
        role: Role.TRAINER
    },
    {
        id: randomUUID(),
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        role: Role.TRAINER
    }
];

export const trainingsFixture = [
    {
        id: randomUUID(),
        name: faker.word.noun(),
        dateStart: faker.date.soon(),
        workoutType: WorkoutType.CALISTHENICS,
        capacity: faker.number.int({ min: 1, max: 100 })
    },
    {
        id: randomUUID(),
        name: faker.word.noun(),
        dateStart: faker.date.soon(),
        workoutType: WorkoutType.CALISTHENICS,
    },
    {
        id: randomUUID(),
        name: faker.word.noun(),
        dateStart: faker.date.soon(),
        workoutType: WorkoutType.BODYBUILDING,
        capacity: faker.number.int({ min: 1, max: 100 })
    },
    {
        id: randomUUID(),
        name: faker.word.noun(),
        dateStart: faker.date.soon(),
        workoutType: WorkoutType.FITNESS,        
    }
];