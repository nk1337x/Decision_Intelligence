import express from 'express';
import {
  saveChatMessage,
  getChatHistory,
  getAllChatSessions,
  deleteChatSession
} from '../controllers/chatHistoryController.js';

const router = express.Router();

router.post('/save', saveChatMessage);
router.get('/session/:sessionId', getChatHistory);
router.get('/sessions', getAllChatSessions);
router.delete('/session/:sessionId', deleteChatSession);

export default router;
