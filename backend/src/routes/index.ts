import express from 'express';
import authRoutes from './auth';
import postRoutes from './posts';
import projectRoutes from './projects';
import commentRoutes from './comments';
import chatRoutes from './chat';
import socialRoutes from './social';
import otpRoutes from './otp';
import integrationRoutes from './integrations';
import webhookRoutes from './webhooks';

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/projects', projectRoutes);
router.use('/comments', commentRoutes);
router.use('/chat', chatRoutes);
router.use('/social', socialRoutes);
router.use('/otp', otpRoutes);

// Integration Routes (Social Media & Payments)
router.use('/integrations', integrationRoutes);

// Webhook Routes (Payment Providers)
router.use('/webhooks', webhookRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API info
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Magna Coders API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      projects: '/api/projects',
      comments: '/api/comments',
      chat: '/api/chat',
      social: '/api/social',
      otp: '/api/otp',
      integrations: '/api/integrations',
      webhooks: '/api/webhooks'
    },
    docs: '/api/docs',
    integrations: {
      social: ['GitHub', 'LinkedIn', 'Twitter', 'Discord'],
      payments: ['Stripe', 'PayPal', 'M-Pesa', 'Wallet'],
      notifications: ['Email', 'SMS', 'WhatsApp']
    }
  });
});

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Documentation',
    version: '1.0.0',
    documentation: {
      swagger: 'https://api.magna-coders.com/docs',
      postman: 'https://api.magna-coders.com/postman',
      github: 'https://github.com/magna-coders/api'
    },
    features: [
      'User Authentication & Authorization',
      'Social Media Integration',
      'Payment Processing',
      'Real-time Chat',
      'Project Marketplace',
      'Content Management',
      'Notification System',
      'OTP Services'
    ]
  });
});

export default router;