import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString, Matches } from 'class-validator';

export class CreateUserDto {
    @IsOptional()  // Add this
    @IsEmail()
    email?: string;  // Make it optional with ?

    @IsOptional()
    @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
    phone?: string;  // Make it optional with ?

    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsOptional()
    @IsString()
    profileImage?: string;

    @IsOptional()
    @IsString()
    countryCode?: string;
}