import { UUID } from "crypto";
import { WorkoutType } from "src/types/workout-type.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GymUser {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;
    @Column()
    name: string;
    @Column()
    surname: string;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string;
    @Column({ nullable: true })
    age?: number;
    @Column({ nullable: true })
    workoutType?: WorkoutType;
    @Column({ nullable: true })
    refreshToken: string


}