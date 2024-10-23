import { WorkoutType } from "src/types/workout-type.enum";

export class GymUserDto {    
    name: string;    
    surname: string;    
    email: string;
    workoutType?: WorkoutType;
    age?: number;
}