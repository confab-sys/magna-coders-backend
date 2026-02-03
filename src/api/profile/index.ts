import express from 'express';
import { ProfileAgent } from '../../AI-assistant/profile-agent/agent';

const router = express.Router();
const agent = new ProfileAgent();

// API endpoint to manage user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    const profile = await agent.getProfile(userId);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Profile fetch failed' });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    const data = req.body;
    const success = await agent.updateProfile(userId, data);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ error: 'Profile update failed' });
  }
});

export default router;