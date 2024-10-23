import { IsNotEmpty, Matches, MinLength, Validate } from "class-validator";
import { UniqueEmailValidator } from "src/custom-validators/email-unique.validator";
import { WorkoutType } from "src/types/workout-type.enum";

export class RegisterGymUserDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    surname: string;
    @IsNotEmpty()  
    @Validate(UniqueEmailValidator)
    email: string;
    @MinLength(8, {
        message: "Password must be at least 8 characters lenght"
    })
    @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/, {
        message: "Password must contain at least one digit, upper letter and special sign" 
    })
    @IsNotEmpty()
    password: string;
    workoutType: WorkoutType;
    age?: number;
}