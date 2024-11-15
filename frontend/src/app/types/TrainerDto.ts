import { Role } from "./Role";

export default interface TrainerDto {
    name: string,
    surname: string,
    email: string,
    password: string,
    role: Role.TRAINER
}