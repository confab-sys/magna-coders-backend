import { login as loginService } from '../../services/authservice/login';
import { refreshToken as refreshService } from '../../services/authservice/refresh';
import { logout as logoutService } from '../../services/authservice/logout';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { SECRET } from '../../utils/config';

const prisma = new PrismaClient();

import { register as registerService } from '../../services/authservice/register';
import { updateUser as updateUserService } from '../../services/authservice/update';

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    const result = await registerService(payload);
    res.status(201).json({ user: result.user });
  } catch (error: any) {
    const status = error?.statusCode || 500;
    res.status(status).json({ message: error?.message || 'Registration failed' });
  }
};

const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      avatar_url: true,
      bio: true,
      location: true,
      website_url: true,
      github_url: true,
      linkedin_url: true,
      twitter_url: true,
      whatsapp_url: true,
      availability: true,
      profile_complete_percentage: true
    }
  });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json(user);
};

const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const requester = req.user as string;

    if (!requester || requester !== userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const data = req.body;
    const updated = await updateUserService(userId, data);
    res.status(200).json(updated);
  } catch (error: any) {
    const status = error?.statusCode || 500;
    res.status(status).json({ message: error?.message || 'Update failed' });
  }
};


const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;
    const result = await loginService({ identifier, password });
    // result contains user, accessToken, refreshToken
    res.status(200).json(result);
  } catch (error: any) {
    const status = error?.statusCode || 500;
    res.status(status).json({ message: error?.message || 'Login failed' });
  }
};

const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const result = await refreshService({ refreshToken });
    res.status(200).json(result);
  } catch (error: any) {
    const status = error?.statusCode || 500;
    res.status(status).json({ message: error?.message || 'Refresh failed' });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body || {};
    const requester = req.user as string | undefined;
    const userId = payload.userId || requester;
    const refreshToken = payload.refreshToken;

    const result = await logoutService({ userId, refreshToken });
    res.status(200).json(result);
  } catch (error: any) {
    const status = error?.statusCode || 500;
    res.status(status).json({ message: error?.message || 'Logout failed' });
  }
};



const verify = async (req: Request, res: Response): Promise<void> => {
  const auth = req.headers.authorization;
  const token = auth && auth.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };
    const user = await prisma.users.findUnique({ where: { id: decoded.id }, select: { id: true, username: true, email: true } });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Account activation endpoint
const activate = async (req: Request, res: Response): Promise<void> => {
  const token = (req.query.token as string) || null;
  const redirectTo = (req.query.redirect as string) || process.env.FRONTEND_URL || 'http://localhost:3000';

  if (!token) {
    const redirectUrl = `${redirectTo}/activate?status=error&reason=missing_token`;
    res.redirect(302, redirectUrl);
    return;
  }

  try {
    const user = await prisma.users.findFirst({ where: { activation_token: token } });
    if (!user) {
      const redirectUrl = `${redirectTo}/activate?status=error&reason=invalid_token`;
      res.redirect(302, redirectUrl);
      return;
    }

    if (user.activation_expires_at && user.activation_expires_at.getTime() < Date.now()) {
      const redirectUrl = `${redirectTo}/activate?status=error&reason=expired_token`;
      res.redirect(302, redirectUrl);
      return;
    }

    await prisma.users.update({ where: { id: user.id }, data: { is_active: true, activation_token: null, activation_expires_at: null } });

    // Send welcome email
    try {
      const { EmailService } = await import('../../services/notifications/email');
      const emailService = new EmailService();
      await emailService.sendWelcomeEmail(user.email);
    } catch (e) {
      // non-fatal
      console.warn('Failed to send welcome email after activation', (e as any).message);
    }

    const redirectUrl = `${redirectTo}/activate?status=success&email=${encodeURIComponent(user.email)}`;
    res.redirect(302, redirectUrl);
  } catch (err) {
    const redirectUrl = `${redirectTo}/activate?status=error&reason=server_error`;
    res.redirect(302, redirectUrl);
  }
};

export { register, login, logout, refresh, verify, activate, getUserProfile, updateUserProfile };
