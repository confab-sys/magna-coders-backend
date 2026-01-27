import express from 'express';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserFeed,
  getNotifications,
  getUnreadNotificationCount,
  searchUsers
} from '../controllers/social/social';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/search', asyncHandler(searchUsers));

// Protected routes
router.use(authenticateToken);

router.post('/follow/:targetUserId', asyncHandler(followUser));
router.delete('/follow/:targetUserId', asyncHandler(unfollowUser));

router.get('/followers/:userId', asyncHandler(getFollowers));
router.get('/following/:userId', asyncHandler(getFollowing));

router.get('/feed', asyncHandler(getUserFeed));

router.get('/notifications', asyncHandler(getNotifications));
router.get('/notifications/unread', asyncHandler(getUnreadNotificationCount));

export default router;