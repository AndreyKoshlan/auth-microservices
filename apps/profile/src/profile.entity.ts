import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('profile')
export class ProfileEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column({ nullable: true })
    phoneNumber?: string;

    @Column({ nullable: true })
    selfDescription?: string;

    @PrimaryGeneratedColumn({ type: 'bigint' })
    userId: number;
}
