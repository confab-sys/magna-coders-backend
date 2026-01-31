import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  otp?: string;
  // optional profile fields
  avatar_url?: string | null;
  location?: string | null;
  bio?: string | null;
  website_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  whatsapp_url?: string | null;
  availability?: string | null;
}

interface RegisterResponse {
  user: {
    id: string;
    username: string;
    email: string;
    avatar_url?: string | null;
    bio?: string | null;
  };
  message: string;
  requiresVerification?: boolean;
}

interface RegisterError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

// Logger utility
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[REGISTER INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error?: any) => {
    console.error(`[REGISTER ERROR] ${message}`, error ? JSON.stringify(error, null, 2) : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[REGISTER WARN] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

// Register new user
export async function register(userData: RegisterRequest): Promise<RegisterResponse> {
  try {
    if (!userData.username || !userData.email || !userData.password) {
      const error: RegisterError = {
        code: 'INVALID_INPUT',
        message: 'Username, email, and password are required',
        statusCode: 400,
        details: {
          username: !!userData.username,
          email: !!userData.email,
          password: !!userData.password
        }
      };
      logger.error('Invalid input data', error);
      throw error;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      const error: RegisterError = {
        code: 'INVALID_EMAIL',
        message: 'Invalid email format',
        statusCode: 400,
        details: { email: userData.email }
      };
      logger.error('Invalid email format', error);
      throw error;
    }

    // Validate password strength
    if (userData.password.length < 8) {
      const error: RegisterError = {
        code: 'WEAK_PASSWORD',
        message: 'Password must be at least 8 characters long',
        statusCode: 400
      };
      logger.error('Weak password', error);
      throw error;
    }

    logger.info('Checking for existing user', { username: userData.username, email: userData.email });

    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { username: { equals: userData.username, mode: 'insensitive' } },
          { email: userData.email }
        ]
      }
    });

    if (existingUser) {
      const field = existingUser.username.toLowerCase() === userData.username.toLowerCase() ? 'username' : 'email';
      const error: RegisterError = {
        code: 'USER_EXISTS',
        message: `${field === 'username' ? 'Username' : 'Email'} already taken`,
        statusCode: 409,
        details: { field, value: field === 'username' ? userData.username : userData.email }
      };
      logger.error('User already exists', error);
      throw error;
    }

    // Hash password
    logger.info('Hashing password');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // Generate user ID
    const userId = uuidv4();

    // Create activation token and expiry (24 hours)
    const activationToken = uuidv4();
    const activationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user with optional profile fields, initially deactivated
    logger.info('Creating user (inactive)', { userId, username: userData.username, email: userData.email });
    const user = await prisma.users.create({
      data: {
        id: userId,
        username: userData.username,
        email: userData.email,
        password_hash: passwordHash,
        avatar_url: userData.avatar_url || null,
        location: userData.location || null,
        bio: userData.bio || null,
        website_url: userData.website_url || null,
        github_url: userData.github_url || null,
        linkedin_url: userData.linkedin_url || null,
        twitter_url: userData.twitter_url || null,
        whatsapp_url: userData.whatsapp_url || null,
        availability: userData.availability || null,
        is_active: false,
        activation_token: activationToken,
        activation_expires_at: activationExpiry
      }
    });

    // Send activation email
    try {
      const { EmailService } = await import('../notifications/email');
      const emailService = new EmailService();
      await emailService.sendActivationEmail(user.email, activationToken);
      logger.info('Activation email sent', { userId: user.id, email: user.email });
    } catch (e) {
      logger.warn('Failed to send activation email', { error: (e as any).message });
    }

    logger.info('User registered successfully (awaiting activation)', { userId: user.id, username: user.username });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      message: 'User registered successfully. Please check your email to activate your account.',
      requiresVerification: true
    };

  } catch (error: any) {
    if (error.code && error.statusCode) {
      throw error;
    }

    // Handle Prisma/database errors
    logger.error('Database error in register', error);

    const dbError: RegisterError = {
      code: 'DATABASE_ERROR',
      message: 'An error occurred while registering user',
      statusCode: 500,
      details: error.message
    };
    throw dbError;
  }
}