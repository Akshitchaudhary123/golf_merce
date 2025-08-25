import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

enum UserStatus {
    ACTIVE = 'active',
    DELETED = 'deleted',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    userName: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ unique: true, nullable: true })
    phone: string;

    @Column({ unique: true, nullable: true })
    countryCode: string;

    @Column({ nullable: true })
    @Exclude({ toPlainOnly: true }) // Exclude from JSON output for security
    password: string;

    @Column({ default: false })
    isEmailVerified: boolean;

    @Column({ default: false })
    isPhoneVerified: boolean;

    @Column({ nullable: true })
    emailVerificationToken: string;

    @Column({ nullable: true })
    emailTokenExpiry: Date;

    @Column({ nullable: true })
    phoneOtp: string;

    @Column({ nullable: true })
    phoneOtpExpiry: Date;

    @Column({ nullable: true })
    profileImage: string;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    })
    status: UserStatus;
}