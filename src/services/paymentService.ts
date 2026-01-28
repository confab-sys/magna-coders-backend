import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

// Initialize payment providers
const stripe: Stripe | null = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY || '', ({ apiVersion: '2023-10-16' } as any))
  : null as any;

interface PaymentData {
  amount: number;
  description?: string;
  fromUserId: string;
  toUserId?: string;
  projectId?: string;
}

class PaymentService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // Process wallet payment
  async processWalletPayment(data: PaymentData): Promise<any> {
    if (!data.toUserId) {
      throw new Error('Recipient user ID required for wallet payments');
    }

    // Check sender's wallet balance
    const senderWallet = await this.prisma.wallets.findUnique({
      where: { user_id: data.fromUserId }
    });

    if (!senderWallet || Number(senderWallet.balance) < data.amount) {
      throw new Error('Insufficient wallet balance');
    }

    // Check recipient's wallet
    const recipientWallet = await this.prisma.wallets.findUnique({
      where: { user_id: data.toUserId }
    });

    if (!recipientWallet) {
      throw new Error('Recipient wallet not found');
    }

    // Process the transfer
    await this.prisma.$transaction(async (tx) => {
      // Deduct from sender
      await tx.wallets.update({
        where: { user_id: data.fromUserId },
        data: { balance: { decrement: data.amount } }
      });

      // Add to recipient
      await tx.wallets.update({
        where: { user_id: data.toUserId },
        data: { balance: { increment: data.amount } }
      });
    });

    return {
      paymentId: `WALLET-${Date.now()}`,
      status: 'COMPLETED',
      message: 'Wallet transfer completed successfully',
    };
  }

  // Get wallet balance
  async getWalletBalance(userId: string): Promise<any> {
    const wallet = await this.prisma.wallets.findUnique({
      where: { user_id: userId },
      select: {
        balance: true,
        created_at: true,
        updated_at: true,
      }
    });

    if (!wallet) {
      // Create wallet if it doesn't exist
      const newWallet = await this.prisma.wallets.create({
        data: { 
          id: `wallet-${userId}-${Date.now()}`,
          user_id: userId,
          balance: 0.0
        },
        select: {
          balance: true,
          created_at: true,
          updated_at: true,
        }
      });
      return newWallet;
    }

    return wallet;
  }

  // Stripe payment processing
  async createStripePaymentIntent(data: PaymentData): Promise<any> {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: 'usd',
      metadata: {
        fromUserId: data.fromUserId,
        toUserId: data.toUserId ?? '',
        projectId: data.projectId ?? '',
      },
      description: data.description,
    });

    return {
      paymentId: `stripe-${paymentIntent.id}`,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }
}

export default PaymentService;
