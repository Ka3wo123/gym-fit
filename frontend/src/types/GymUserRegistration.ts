import { WorkoutType } from "./WorkoutType"

export default interface GymUserRegistration {
    name: string,
    surname: string,
    email: string,
    workoutType: WorkoutType,
    age: number,
    password: string
}