import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// TypeScript interfaces
interface LogoutRequest {
  userId: string;
  token?: string;
}

interface LogoutResponse {
  message: string;
  success: boolean;
}

interface LogoutError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

// Logger utility
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[LOGOUT INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error?: any) => {
    console.error(`[LOGOUT ERROR] ${message}`, error ? JSON.stringify(error, null, 2) : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[LOGOUT WARN] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

export async function logout(userId: LogoutRequest | string | { userId?: string; refreshToken?: string }): Promise<LogoutResponse> {
  try {
    const request: LogoutRequest & { refreshToken?: string } = typeof userId === 'string' ? { userId } : userId as any;

    if (!request.userId && !request.refreshToken) {
      const error: LogoutError = {
        code: 'INVALID_REQUEST',
        message: 'userId or refreshToken is required to logout',
        statusCode: 400
      };
      logger.error('Invalid logout request', error);
      throw error;
    }

    logger.info('Processing logout', { userId: request.userId, hasRefreshToken: !!request.refreshToken });

    if (request.refreshToken) {
      // Revoke the provided refresh token
      await prisma.refresh_tokens.updateMany({ where: { token: request.refreshToken }, data: { revoked: true } });
      logger.info('Revoked refresh token', { tokenPreview: request.refreshToken.slice(0, 8) });
    } else if (request.userId) {
      // Revoke all refresh tokens for the user
      const invalidated = await prisma.refresh_tokens.updateMany({ where: { user_id: request.userId, revoked: false }, data: { revoked: true } });
      logger.info('Revoked refresh tokens for user', { userId: request.userId, count: invalidated.count });
    }

    const response: LogoutResponse = {
      message: 'Logged out successfully',
      success: true
    };

    logger.info('Logout completed successfully', { userId: request.userId });

    return response;

  } catch (error: any) {
    if (error.code && error.statusCode) {
      throw error;
    }

    logger.error('Database error in logout', error);

    const dbError: LogoutError = {
      code: 'DATABASE_ERROR',
      message: 'An error occurred during logout',
      statusCode: 500,
      details: error.message
    };
    throw dbError;
  }
}