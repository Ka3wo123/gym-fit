import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { WorkoutType } from "src/types/workout-type.enum";

export class TrainingDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    dateStart: Date;
    @IsOptional()
    @IsEnum(WorkoutType)
    workoutType?: WorkoutType;
}