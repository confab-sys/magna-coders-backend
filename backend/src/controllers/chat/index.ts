import { Request, Response } from 'express';
import { PrismaClient, ChatType } from '@prisma/client';

const prisma = new PrismaClient();

const getUserChats = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user as string;

  const chatRooms = await prisma.chatRoomMember.findMany({
    where: { userId },
    include: {
      chatRoom: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  isVerified: true,
                }
              }
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                }
              }
            }
          }
        }
      }
    }
  });

  const formattedChats = chatRooms.map(member => ({
    id: member.chatRoom.id,
    name: member.chatRoom.name,
    type: member.chatRoom.type,
    members: member.chatRoom.members.map(m => m.user),
    lastMessage: member.chatRoom.messages[0] || null,
    joinedAt: member.joinedAt,
  }));

  res.status(200).json(formattedChats);
};

const getChatMessages = async (req: Request, res: Response): Promise<void> => {
  const { chatId } = req.params;
  const userId = req.user as string;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;

  // Check if user is member of this chat
  const membership = await prisma.chatRoomMember.findFirst({
    where: {
      chatRoomId: chatId,
      userId,
    }
  });

  if (!membership) {
    res.status(403).send({ message: 'Access denied.' });
    return;
  }

  const messages = await prisma.message.findMany({
    where: { chatRoomId: chatId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true,
          isVerified: true,
        }
      }
    }
  });

  res.status(200).json(messages.reverse()); // Reverse to show oldest first
};

const createDirectChat = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user as string;
  const { otherUserId } = req.body;

  if (!otherUserId) {
    res.status(400).send({ message: 'Other user ID is required.' });
    return;
  }

  // Check if users exist
  const [user, otherUser] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.user.findUnique({ where: { id: otherUserId } })
  ]);

  if (!user || !otherUser) {
    res.status(404).send({ message: 'User not found.' });
    return;
  }

  // Check if direct chat already exists
  const existingChat = await prisma.chatRoom.findFirst({
    where: {
      type: 'DIRECT',
      members: {
        every: {
          userId: { in: [userId, otherUserId] }
        }
      }
    },
    include: {
      members: true,
    }
  });

  if (existingChat && existingChat.members.length === 2) {
    res.status(200).json(existingChat);
    return;
  }

  // Create new direct chat
  const chatRoom = await prisma.chatRoom.create({
    data: {
      type: 'DIRECT',
      members: {
        create: [
          { userId },
          { userId: otherUserId }
        ]
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
              isVerified: true,
            }
          }
        }
      }
    }
  });

  res.status(201).json(chatRoom);
};

const createGroupChat = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user as string;
  const { name, memberIds } = req.body;

  if (!name || !memberIds || !Array.isArray(memberIds)) {
    res.status(400).send({ message: 'Chat name and member IDs are required.' });
    return;
  }

  if (memberIds.length < 2) {
    res.status(400).send({ message: 'Group chat must have at least 2 members.' });
    return;
  }

  // Add creator to members if not included
  const allMemberIds = [...new Set([...memberIds, userId])];

  // Verify all users exist
  const users = await prisma.user.findMany({
    where: { id: { in: allMemberIds } }
  });

  if (users.length !== allMemberIds.length) {
    res.status(404).send({ message: 'One or more users not found.' });
    return;
  }

  const chatRoom = await prisma.chatRoom.create({
    data: {
      name,
      type: 'GROUP',
      members: {
        create: allMemberIds.map(id => ({ userId: id }))
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
              isVerified: true,
            }
          }
        }
      }
    }
  });

  res.status(201).json(chatRoom);
};

const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const { chatId } = req.params;
  const userId = req.user as string;
  const { content, messageType } = req.body;

  if (!content) {
    res.status(400).send({ message: 'Message content is required.' });
    return;
  }

  // Check if user is member of this chat or not
  const membership = await prisma.chatRoomMember.findFirst({
    where: {
      chatRoomId: chatId,
      userId,
    }
  });

  if (!membership) {
    res.status(403).send({ message: 'Access denied.' });
    return;
  }

  const message = await prisma.message.create({
    data: {
      content,
      messageType: messageType || 'TEXT',
      chatRoom: { connect: { id: chatId } },
      sender: { connect: { id: userId } },
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true,
          isVerified: true,
        }
      }
    }
  });

  res.status(201).json(message);
};

const leaveChat = async (req: Request, res: Response): Promise<void> => {
  const { chatId } = req.params;
  const userId = req.user as string;

  const membership = await prisma.chatRoomMember.findFirst({
    where: {
      chatRoomId: chatId,
      userId,
    }
  });

  if (!membership) {
    res.status(404).send({ message: 'Not a member of this chat.' });
    return;
  }

  await prisma.chatRoomMember.delete({
    where: { id: membership.id }
  });

  // If it's a direct chat or group chat with only one member left, deactivate it instead of deleting
  const remainingMembers = await prisma.chatRoomMember.count({
    where: { chatRoomId: chatId }
  });

  if (remainingMembers === 0) {
    await prisma.chatRoom.update({
      where: { id: chatId },
      data: { isActive: false }
    });
  }

  res.status(200).json({ message: 'Left chat successfully.' });
};

export {
  getUserChats,
  getChatMessages,
  createDirectChat,
  createGroupChat,
  sendMessage,
  leaveChat,
};