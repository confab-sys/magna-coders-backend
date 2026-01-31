import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type UpdateUserData = Partial<{
  username: string;
  email: string;
  password: string;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  website_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  whatsapp_url: string | null;
  availability: string | null;
}>;

export async function updateUser(userId: string, data: UpdateUserData) {
  // Only allow specific fields
  const allowed = [
    'username', 'email', 'password', 'avatar_url', 'location', 'bio', 'website_url',
    'github_url', 'linkedin_url', 'twitter_url', 'whatsapp_url', 'availability'
  ];

  const updatePayload: any = {};
  for (const key of allowed) {
    if (key in data && data[key as keyof UpdateUserData] !== undefined) {
      updatePayload[key] = (data as any)[key];
    }
  }

  // Handle password hashing
  if (updatePayload.password) {
    updatePayload.password_hash = await bcrypt.hash(updatePayload.password, 10);
    delete updatePayload.password;
  }

  // If updating username or email, ensure uniqueness
  if (updatePayload.username || updatePayload.email) {
    const conflict = await prisma.users.findFirst({
      where: {
        OR: [
          updatePayload.username ? { username: updatePayload.username } : undefined,
          updatePayload.email ? { email: updatePayload.email } : undefined
        ].filter(Boolean) as any,
        AND: [{ id: { not: userId } }]
      }
    });

    if (conflict) {
      throw { statusCode: 409, message: 'Username or email already in use' };
    }
  }

  const updated = await prisma.users.update({
    where: { id: userId },
    data: updatePayload,
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

  return updated;
}