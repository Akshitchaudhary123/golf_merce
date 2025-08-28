import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailService } from 'libs/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, phone, password } = createUserDto;

    // Validate that either email or phone is provided
    if (!email && !phone) {
      throw new BadRequestException('Either email or phone number must be provided.');
    }

    // Check if user already exists
    let existingUser = await this.userRepository.findOne({
      where: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ],
    });

    if (existingUser) {
      if (!existingUser.isEmailVerified && !existingUser.isPhoneVerified) {
        // Update existing unverified user
        existingUser.firstName = createUserDto.firstName;
        existingUser.lastName = createUserDto.lastName;
        existingUser.userName = createUserDto.userName;
        existingUser.password = await bcrypt.hash(password, 10);

        // Only update email if provided
        if (email) {
          existingUser.email = email;
        }

        // Only update phone if provided
        if (phone) {
          existingUser.phone = phone;
        }

        existingUser.profileImage = createUserDto.profileImage ?? existingUser.profileImage;

        // Generate new verification tokens/OTPs for the updated contact info
        if (email) {
          existingUser.emailVerificationToken = randomBytes(32).toString('hex');
          existingUser.emailTokenExpiry = new Date(Date.now() + Number(process.env.EMAIL_TOKEN_EXPIRY || '5') * 60 * 1000);
        }

        if (phone) {
          existingUser.phoneOtp = (123456).toString(); // Use proper OTP generation in production
          existingUser.phoneOtpExpiry = new Date(Date.now() + Number(process.env.EMAIL_TOKEN_EXPIRY || '5') * 60 * 1000);
        }

        const updatedUser = await this.userRepository.save(existingUser);

        // Send verification for updated contact methods
        await this.sendVerificationMessages(updatedUser, email, phone);

        return updatedUser;
      } else {
        throw new ConflictException(
          'User with this email or phone already exists and is verified.',
        );
      }
    }

    // Generate verification tokens/OTPs
    const emailVerificationToken = email ? randomBytes(32).toString('hex') : undefined;
    const emailTokenExpiry = email ? new Date(Date.now() + Number(process.env.EMAIL_TOKEN_EXPIRY || '5') * 60 * 1000) : undefined;
    let phoneOtp = phone ? Math.floor(100000 + Math.random() * 900000).toString() : undefined;
    phoneOtp = phone ? (123456).toString() : undefined; // Use proper OTP generation in production
    const phoneOtpExpiry = phone ? new Date(Date.now() + Number(process.env.EMAIL_TOKEN_EXPIRY || '5') * 60 * 1000) : undefined;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user data object with explicit field assignment
    const userData: Partial<User> = {
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      userName: createUserDto.userName,
      password: hashedPassword,
      profileImage: createUserDto.profileImage,
      emailVerificationToken,
      emailTokenExpiry,
      phoneOtp,
      phoneOtpExpiry,
    };

    // Only add email if provided
    if (email) {
      userData.email = email;
    }

    // Only add phone if provided  
    if (phone) {
      userData.phone = phone;
    }

    // Create new user
    const newUser = this.userRepository.create(userData);

    // Save user in DB
    const savedUser = await this.userRepository.save(newUser);

    // Send verification messages
    await this.sendVerificationMessages(savedUser, email, phone);

    return savedUser;
  }

  /**
   * Helper method to send verification messages
   */
  private async sendVerificationMessages(user: User, email?: string, phone?: string): Promise<void> {
    try {
      // Send email verification if email is provided
      if (email && user.emailVerificationToken) {
        const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${user.emailVerificationToken}&userId=${user.id}`;

        await this.mailService.enqueueEmail(
          user.email,
          'Verify your email',
          `<h1>Hello ${user.firstName},</h1>
           <p>Please verify your email by clicking the link below:</p>
           <a href="${verificationUrl}">${verificationUrl}</a>
           <p>This link will expire in ${process.env.EMAIL_TOKEN_EXPIRY || '5'} minutes.</p>`
        );
      }

      // Send phone verification if phone is provided
      if (phone && user.phoneOtp) {
        // TODO: Implement SMS service integration
        // await this.smsService.sendOtp(user.phone, user.phoneOtp);


        console.log(`SMS OTP for ${user.phone}: ${user.phoneOtp}`);
      }
    } catch (error) {
      console.error('Error sending verification messages:', error);
      // Optionally, you might want to delete the user if verification sending fails
      // or handle this error according to your business requirements
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Find user by phone
   */
  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Update user verification status
   */
  // async updateEmailVerificationStatus(id: string, isVerified: boolean): Promise<User> {
  //   await this.userRepository.update(id, {
  //     isEmailVerified: isVerified,
  //     emailVerificationToken: undefined,
  //     emailTokenExpiry: undefined
  //   });
  //   return this.findById(id);
  // }

  /**
   * Update phone verification status
   */
  // async updatePhoneVerificationStatus(id: string, isVerified: boolean): Promise<User> {
  //   await this.userRepository.update(id, {
  //     isPhoneVerified: isVerified,
  //     phoneOtp: undefined,
  //     phoneOtpExpiry: undefined
  //   });
  //   return this.findById(id);
  // }
}