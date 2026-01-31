import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { SECRET } from '../../utils/config';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

interface RefreshRequest {
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

interface RefreshError {
  code: string;
  message: string;
  statusCode: number;
}

function generateAccessToken(userId: string): string {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(userId: string): string {
  return jwt.sign({ id: userId, type: 'refresh' }, SECRET, { expiresIn: '30d' });
}

export async function refreshToken(payload: RefreshRequest): Promise<RefreshResponse> {
  try {
    if (!payload?.refreshToken) {
      const err: RefreshError = { code: 'MISSING_TOKEN', message: 'Refresh token required', statusCode: 400 };
      throw err;
    }

    // Find token record
    const record = await prisma.refresh_tokens.findUnique({ where: { token: payload.refreshToken } });
    if (!record) {
      const err: RefreshError = { code: 'INVALID_TOKEN', message: 'Refresh token not found', statusCode: 401 };
      throw err;
    }

    if (record.revoked) {
      const err: RefreshError = { code: 'REVOKED', message: 'Refresh token has been revoked', statusCode: 401 };
      throw err;
    }

    if (record.expires_at && record.expires_at.getTime() < Date.now()) {
      const err: RefreshError = { code: 'EXPIRED', message: 'Refresh token expired', statusCode: 401 };
      throw err;
    }

    // Verify JWT signature and payload
    let decoded: any;
    try {
      decoded = jwt.verify(payload.refreshToken, SECRET) as { id: string; type?: string };
    } catch (e) {
      const err: RefreshError = { code: 'INVALID_JWT', message: 'Invalid refresh token', statusCode: 401 };
      throw err;
    }

    if (!decoded || decoded.type !== 'refresh') {
      const err: RefreshError = { code: 'INVALID_TOKEN_TYPE', message: 'Not a refresh token', statusCode: 401 };
      throw err;
    }

    const userId = decoded.id as string;

    // Rotate refresh token: revoke old, create a new one
    await prisma.refresh_tokens.update({ where: { token: payload.refreshToken }, data: { revoked: true } });

    const newRefreshToken = generateRefreshToken(userId);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await prisma.refresh_tokens.create({ data: { id: uuidv4(), token: newRefreshToken, user_id: userId, revoked: false, expires_at: expiresAt } });

    const accessToken = generateAccessToken(userId);

    return { accessToken, refreshToken: newRefreshToken };

  } catch (error: any) {
    if (error.code && error.statusCode) throw error;
    const err: RefreshError = { code: 'UNKNOWN_ERROR', message: 'An error occurred while refreshing token', statusCode: 500 };
    throw err;
  }
}
