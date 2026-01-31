import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { SECRET } from '../../utils/config';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

interface LoginRequest {
  identifier: string; // email or username
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface LoginError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

// Logger utility
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[LOGIN INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error?: any) => {
    console.error(`[LOGIN ERROR] ${message}`, error ? JSON.stringify(error, null, 2) : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[LOGIN WARN] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

// Generate short-lived access token (15m)
function generateAccessToken(userId: string): string {
  return jwt.sign(
    { id: userId },
    SECRET,
    { expiresIn: '15m' }
  );
}

// Generate refresh token (JWT, stored server-side)
function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    SECRET,
    { expiresIn: '30d' }
  );
}

// Login user with security checks
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    if (!credentials.identifier || !credentials.password) {
      const error: LoginError = {
        code: 'INVALID_CREDENTIALS',
        message: 'Identifier and password are required',
        statusCode: 400
      };
      logger.error('Invalid login credentials', error);
      throw error;
    }

    logger.info('Attempting login', { identifier: credentials.identifier });

    // Find user by email or username
    const user = await prisma.users.findFirst({
      where: {
        OR: [
          { username: { equals: credentials.identifier, mode: 'insensitive' } },
          { email: { equals: credentials.identifier, mode: 'insensitive' } }
        ]
      }
    });

    if (!user) {
      const error: LoginError = {
        code: 'USER_NOT_FOUND',
        message: 'Invalid identifier or password',
        statusCode: 401
      };
      logger.warn('User not found', { identifier: credentials.identifier });
      throw error;
    }

    // Verify account active
    if (!user.is_active) {
      const error: LoginError = {
        code: 'ACCOUNT_INACTIVE',
        message: 'Account is inactive. Please activate via the email link.',
        statusCode: 403
      };
      logger.warn('Attempt to login to inactive account', { userId: user.id });
      throw error;
    }

    // Verify password
    if (!user.password_hash) {
      const error: LoginError = {
        code: 'NO_PASSWORD',
        message: 'Account not configured for password login',
        statusCode: 500
      };
      logger.error('No password hash found for user', { userId: user.id });
      throw error;
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
    if (!isValidPassword) {
      const error: LoginError = {
        code: 'INVALID_PASSWORD',
        message: 'Invalid identifier or password',
        statusCode: 401
      };
      logger.warn('Invalid password attempt', { userId: user.id });
      throw error;
    }

    logger.info('Login successful', { userId: user.id });

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Persist refresh token in DB
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await prisma.refresh_tokens.create({
      data: {
        id: uuidv4(),
        token: refreshToken,
        user_id: user.id,
        revoked: false,
        expires_at: expiresAt
      }
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      accessToken,
      refreshToken
    };

  } catch (error: any) {
    // Re-throw custom errors
    if (error.code && error.statusCode) {
      throw error;
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      const jwtError: LoginError = {
        code: 'JWT_ERROR',
        message: 'Token generation failed',
        statusCode: 500,
        details: error.message
      };
      logger.error('JWT generation error', jwtError);
      throw jwtError;
    }

    // Handle database errors
    logger.error('Database error in login', error);

    const dbError: LoginError = {
      code: 'DATABASE_ERROR',
      message: 'An error occurred during login',
      statusCode: 500,
      details: error.message
    };
    throw dbError;
  }
}