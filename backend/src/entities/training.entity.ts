import { UUID } from "crypto";
import { WorkoutType } from "src/types/workout-type.enum";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { GymUser } from "./gym-user.entity";

@Entity()
export class Training {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;
    @Column()
    name: string;
    @Column()
    dateStart: Date;
    @Column({ type: 'enum', enum: WorkoutType, default: null })
    workoutType: WorkoutType;
    @Column({ nullable: true })
    capacity: number;  
    @ManyToMany(() => GymUser, (user) => user.trainings)
    users: GymUser[];

}