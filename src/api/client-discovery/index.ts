import express from 'express';
import { ClientDiscoveryAgent } from '../../AI-assistant/client-discovery-agent/agent';

const router = express.Router();
const agent = new ClientDiscoveryAgent();

router.get('/find-clients', async (req, res) => {
  try {
    const query = req.query.query as string;
    const userId = req.query.userId as string; // Assuming userId is passed in query or from auth middleware

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const clients = await agent.findClients(query, userId);
    return res.json({ clients });
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('eligibility')) {
      return res.status(403).json({ error: err.message });
    } else {
      return res.status(500).json({ error: 'Client discovery failed' });
    }
  }
});

// LinkedIn OAuth endpoints
router.get('/linkedin/auth-url', (req, res) => {
  try {
    const state = req.query.state as string || 'default';
    const authUrl = agent.generateLinkedInAuthUrl(state);
    return res.json({ authUrl });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
});

router.post('/linkedin/callback', async (req, res) => {
  try {
    const { code, userId } = req.body;

    if (!code || !userId) {
      return res.status(400).json({ error: 'Authorization code and user ID are required' });
    }

    const tokenData = await agent.exchangeCodeForToken(code);
    await agent.storeUserLinkedInToken(userId, tokenData);

    return res.json({ success: true, message: 'LinkedIn account connected successfully' });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
});

router.get('/linkedin/profile', async (req, res) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // For now, return a placeholder
    return res.json({ message: 'LinkedIn profile endpoint - requires stored access token' });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
});

router.get('/linkedin/companies', async (req, res) => {
  try {
    const query = req.query.query as string;
    const userId = req.query.userId as string;

    if (!query || !userId) {
      return res.status(400).json({ error: 'Query and user ID are required' });
    }

    // This would use the user's stored LinkedIn access token
    return res.json({ message: 'LinkedIn companies search endpoint - requires access token' });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
});

router.get('/linkedin/jobs', async (req, res) => {
  try {
    const keywords = req.query.keywords as string;
    const location = req.query.location as string;
    const userId = req.query.userId as string;

    if (!keywords || !location || !userId) {
      return res.status(400).json({ error: 'Keywords, location, and user ID are required' });
    }

    // This would use the user's stored LinkedIn access token
    return res.json({ message: 'LinkedIn jobs search endpoint - requires access token' });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
});

export default router;