import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { WorkoutType } from "src/types/workout-type.enum";

export class UpdateTrainingDto {
    @IsString()
    @IsOptional()
    name?: string;
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    dateStart?: Date;
    @IsOptional()
    @IsEnum(WorkoutType)
    workoutType?: WorkoutType;
}