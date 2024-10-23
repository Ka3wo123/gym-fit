import { IsNotEmpty } from "class-validator";

export class AuthGymUserDto {
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    password: string;

}