import { UUID } from "crypto";
import { WorkoutType } from "src/types/workout-type.enum";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Training } from "./training.entity";
import { Role } from "src/types/roles.enum";

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
    @Column({ type: 'enum', enum: WorkoutType, nullable: true })
    workoutType?: WorkoutType;
    @Column({ nullable: true })
    refreshToken: string;
    @Column({ type: 'enum', enum: Role, default: Role.USER })    
    role: Role;
    @ManyToMany(() => Training, (training) => training.users)
    @JoinTable({
        name: 'user_trainings',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'training_id',
            referencedColumnName: 'id'
        }
    })
    trainings: Training[];


}