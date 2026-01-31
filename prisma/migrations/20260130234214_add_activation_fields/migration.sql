-- AlterTable
ALTER TABLE "users" ADD COLUMN     "activation_expires_at" TIMESTAMPTZ(6),
ADD COLUMN     "activation_token" VARCHAR,
ADD COLUMN     "is_active" BOOLEAN DEFAULT false;
