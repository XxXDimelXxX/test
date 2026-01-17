import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UsersEntity {
    @PrimaryColumn()
    id: number;

    /**
     * Aggregated user balance in **cents**.
     * Stored as bigint in DB; TypeORM returns bigint as string.
     */
    @Column({ type: 'bigint' })
    balance: string;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
