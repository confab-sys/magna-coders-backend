/*
  Warnings:
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `color` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `categories` table. All the data in the column will be lost.
  - The `id` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `isEdited` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `repliesCount` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `comments` table. All the data in the column will be lost.
  - The `id` column on the `comments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `commentId` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `replyId` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `likes` table. All the data in the column will be lost.
  - The `id` column on the `likes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chatRoomId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `isEdited` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `messageType` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `messages` table. All the data in the column will be lost.
  - The `id` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `commentId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `messageId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `notifications` table. All the data in the column will be lost.
  - The `id` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `commentsCount` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `postType` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `sharesCount` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedAt` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedBy` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `viewsCount` on the `posts` table. All the data in the column will be lost.
  - The `id` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assignedToId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `budget` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `deadline` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `githubUrl` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `liveUrl` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `projectType` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `technologies` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `projects` table. All the data in the column will be lost.
  - The `id` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `backupCodes` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `commentKarma` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLoginAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lockedUntil` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `loginAttempts` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `portfolioUrl` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `postKarma` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `tokens` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorEnabled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorSecret` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verificationBadge` on the `users` table. All the data in the column will be lost.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `wallets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `wallets` table. All the data in the column will be lost.
  - The `id` column on the `wallets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `balance` on the `wallets` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the `bids` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat_room_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat_rooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `follows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refresh_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `replies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `social_integrations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `wallets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversation_id` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `wallets` table without a default value. This is not possible if the table is not empty.
*/
-- DropForeignKey
-- DropForeignKey
ALTER TABLE "public"."bids" DROP CONSTRAINT "bids_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."chat_room_members" DROP CONSTRAINT "chat_room_members_chatRoomId_fkey";
ADD COLUMN     "id" UUID NOT NULL,
-- DropForeignKey
ALTER TABLE "public"."chat_room_members" DROP CONSTRAINT "chat_room_members_userId_fkey";

ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."follows" DROP CONSTRAINT "follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."follows" DROP CONSTRAINT "follows_followingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."likes" DROP CONSTRAINT "likes_commentId_fkey";
ADD COLUMN     "id" UUID NOT NULL,
-- DropForeignKey
ALTER TABLE "public"."likes" DROP CONSTRAINT "likes_postId_fkey";
-- DropForeignKey
ALTER TABLE "public"."likes" DROP CONSTRAINT "likes_replyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."likes" DROP CONSTRAINT "likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_chatRoomId_fkey";

ADD COLUMN     "id" UUID NOT NULL,
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_senderId_fkey";

ALTER TABLE "public"."notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_toUserId_fkey";

ADD COLUMN     "id" UUID NOT NULL,
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_walletId_fkey";

ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."posts" DROP CONSTRAINT "posts_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_clientId_fkey";
ADD COLUMN     "id" UUID NOT NULL,
-- DropForeignKey
ALTER TABLE "public"."refresh_tokens" DROP CONSTRAINT "refresh_tokens_userId_fkey";

ALTER TABLE "public"."replies" DROP CONSTRAINT "replies_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."replies" DROP CONSTRAINT "replies_commentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."reports" DROP CONSTRAINT "reports_reportedPostId_fkey";

-- DropForeignKey
ALTER TABLE "public"."reports" DROP CONSTRAINT "reports_reportedUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."reports" DROP CONSTRAINT "reports_reporterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."social_integrations" DROP CONSTRAINT "social_integrations_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."wallets" DROP CONSTRAINT "wallets_userId_fkey";
ADD COLUMN     "id" UUID NOT NULL,
-- DropIndex
DROP INDEX "public"."wallets_userId_key";

ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
DROP COLUMN "color",
DROP COLUMN "createdAt",
DROP COLUMN "icon",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
ALTER COLUMN "name" SET DATA TYPE VARCHAR,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "comments" DROP CONSTRAINT "comments_pkey",
DROP COLUMN "authorId",
DROP COLUMN "createdAt",
DROP COLUMN "isEdited",
DROP COLUMN "likesCount",
DROP COLUMN "postId",
DROP COLUMN "repliesCount",
DROP COLUMN "updatedAt",
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
ADD COLUMN     "post_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
DROP COLUMN "id",
ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "likes" DROP CONSTRAINT "likes_pkey",
DROP COLUMN "commentId",
DROP COLUMN "createdAt",
DROP COLUMN "postId",
DROP COLUMN "replyId",
DROP COLUMN "userId",
ADD COLUMN     "post_id" UUID NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "messages" DROP CONSTRAINT "messages_pkey",
DROP COLUMN "chatRoomId",
DROP COLUMN "createdAt",
DROP COLUMN "isEdited",
DROP COLUMN "messageType",
DROP COLUMN "senderId",
DROP COLUMN "updatedAt",
ADD COLUMN     "conversation_id" UUID NOT NULL,
ADD COLUMN     "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
ADD COLUMN     "sender_id" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "createdAt",
DROP COLUMN "isRead",
DROP COLUMN "messageId",
DROP COLUMN "postId",
DROP COLUMN "type",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
ALTER COLUMN "title" SET DATA TYPE VARCHAR,
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

ADD COLUMN     "id" UUID NOT NULL,
ALTER TABLE "posts" DROP CONSTRAINT "posts_pkey",
DROP COLUMN "authorId",
DROP COLUMN "categoryId",
DROP COLUMN "commentsCount",
DROP COLUMN "createdAt",
DROP COLUMN "isVerified",
DROP COLUMN "likesCount",
DROP COLUMN "postType",
DROP COLUMN "sharesCount",
DROP COLUMN "tags",
DROP COLUMN "updatedAt",
DROP COLUMN "verifiedAt",
DROP COLUMN "verifiedBy",
DROP COLUMN "viewsCount",
ADD COLUMN     "author_id" UUID NOT NULL,
ADD COLUMN     "category_id" UUID,
ADD COLUMN     "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
ALTER COLUMN "title" SET DATA TYPE VARCHAR,
ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "projects" DROP CONSTRAINT "projects_pkey",
DROP COLUMN "assignedToId",
DROP COLUMN "budget",
DROP COLUMN "categoryId",
DROP COLUMN "clientId",
DROP COLUMN "createdAt",
DROP COLUMN "deadline",
DROP COLUMN "githubUrl",
DROP COLUMN "images",
DROP COLUMN "liveUrl",
DROP COLUMN "projectType",
DROP COLUMN "status",
DROP COLUMN "technologies",
DROP COLUMN "updatedAt",
ADD COLUMN     "category_id" UUID,
ADD COLUMN     "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
ADD COLUMN     "owner_id" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
ALTER COLUMN "title" SET DATA TYPE VARCHAR,
ALTER COLUMN "description" DROP NOT NULL,
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "avatar",
DROP COLUMN "backupCodes",
DROP COLUMN "commentKarma",
DROP COLUMN "createdAt",
DROP COLUMN "experience",
DROP COLUMN "isVerified",
DROP COLUMN "lastLoginAt",
DROP COLUMN "lockedUntil",
DROP COLUMN "loginAttempts",
DROP COLUMN "passwordHash",
DROP COLUMN "phone",
DROP COLUMN "portfolioUrl",
DROP COLUMN "postKarma",
DROP COLUMN "role",
DROP COLUMN "skills",
DROP COLUMN "tokens",
DROP COLUMN "twoFactorEnabled",
DROP COLUMN "twoFactorSecret",
DROP COLUMN "updatedAt",
DROP COLUMN "verificationBadge",
ADD COLUMN     "availability" VARCHAR DEFAULT 'available',
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
ADD COLUMN     "github_url" TEXT,
ADD COLUMN     "linkedin_url" TEXT,
ADD COLUMN     "profile_complete_percentage" INTEGER DEFAULT 0,
ADD COLUMN     "twitter_url" TEXT,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
ADD COLUMN     "website_url" TEXT,
ADD COLUMN     "whatsapp_url" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
ALTER COLUMN "username" SET DATA TYPE VARCHAR,
ALTER COLUMN "email" SET DATA TYPE VARCHAR,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "currency",
DROP COLUMN "isActive",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(10,2),
ADD CONSTRAINT "wallets_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."bids";

-- DropTable
DROP TABLE "public"."chat_room_members";

-- DropTable
DROP TABLE "public"."chat_rooms";

-- DropTable
DROP TABLE "public"."follows";

-- DropTable
DROP TABLE "public"."payments";

-- DropTable
DROP TABLE "public"."refresh_tokens";

-- DropTable
DROP TABLE "public"."replies";

-- DropTable
DROP TABLE "public"."reports";

-- DropTable
DROP TABLE "public"."social_integrations";

-- DropEnum
DROP TYPE "public"."BidStatus";

-- DropEnum
DROP TYPE "public"."ChatType";

-- DropEnum
DROP TYPE "public"."Currency";

-- DropEnum
DROP TYPE "public"."MessageType";

-- DropEnum
DROP TYPE "public"."NotificationType";

-- DropEnum
DROP TYPE "public"."PaymentMethod";

-- DropEnum
DROP TYPE "public"."PaymentStatus";

-- DropEnum
DROP TYPE "public"."PostType";

-- DropEnum
DROP TYPE "public"."ProjectStatus";

-- DropEnum
DROP TYPE "public"."ProjectType";

-- DropEnum
DROP TYPE "public"."ReportStatus";

-- DropEnum
DROP TYPE "public"."SocialPlatform";

-- DropEnum
DROP TYPE "public"."UserRole";

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skills" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,

    CONSTRAINT "user_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "description" TEXT,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_categories" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "user_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_media" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "post_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,

    CONSTRAINT "post_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "url" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "project_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" VARCHAR,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR NOT NULL,
    "description" TEXT,
    "author_id" UUID NOT NULL,
    "category_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR NOT NULL,
    "description" TEXT,
    "created_by" UUID NOT NULL,
    "event_date" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friends" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "friend_id" UUID NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_requests" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "sender_id" UUID NOT NULL,
    "receiver_id" UUID NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "friend_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR,
    "is_group" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_members" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "conversation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "conversation_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reels" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR NOT NULL,
    "video_url" VARCHAR NOT NULL,
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "reels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_categories" ADD CONSTRAINT "user_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_categories" ADD CONSTRAINT "user_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversation_members" ADD CONSTRAINT "conversation_members_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversation_members" ADD CONSTRAINT "conversation_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reels" ADD CONSTRAINT "reels_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
