import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { WorkoutType } from "src/types/workout-type.enum";

export class TrainingDto {
    @IsUUID()
    @IsOptional()
    id?: UUID;
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
    @IsOptional()
    @IsNumber()
    capacity?: number;
    @IsNumber()
    @IsOptional()
    freeSpaces?: number;   
}