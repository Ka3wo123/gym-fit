import { UUID } from "crypto";
import { Role } from "src/types/roles.enum";
import { WorkoutType } from "src/types/workout-type.enum";

export class GymUserDto { 
    id: UUID; 
    name: string;    
    surname: string;    
    email: string;
    workoutType?: WorkoutType;
    age?: number;
    role: Role;
}