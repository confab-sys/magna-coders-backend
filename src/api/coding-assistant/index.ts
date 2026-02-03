import express from 'express';
import { CodingAgent } from "../../AI-assistant/profile-agent/agent";

const router = express.Router();
const agent = new CodingAgent();

router.post('/assist', async (req, res) => {
  try {
    const code = req.body.code;
    const result = await agent.assistCoding(code);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Coding assistance failed' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const message = req.body.message;
    const response = await agent.chat(message);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Chat failed' });
  }
});

export default router;