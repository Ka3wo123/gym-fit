import { WorkoutType } from "./WorkoutType"

export default interface GymUser {
    name: string,
    surname: string,
    email: string,
    workoutType: WorkoutType,
    age: number
}