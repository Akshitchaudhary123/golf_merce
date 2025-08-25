
import { Column, PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true })
    countryCode: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: false, unique: true })
    userName: string;

    @Column({ type: 'varchar', nullable: true })
    emailVerificationToken: string;

    @Column({ type: 'timestamptz', nullable: true }) // PostgreSQL timestamp with timezone
    emailTokenExpiry: Date | null;

    @Column({ default: false })
    isEmailVerified: boolean;

    // @Column()
    // status:string;
    // enum:['active','delete'];
    // default:'active'

    @Column({ nullable: true })
    phoneOtp: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column({ type: 'timestamptz', nullable: true }) // PostgreSQL timestamp with timezone
    phoneOtpExpiry: Date;

    @Column({ default: false })
    isPhoneVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}