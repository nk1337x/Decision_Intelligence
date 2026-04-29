import ChatHistory from '../models/ChatHistory.js';

// Save chat message
export const saveChatMessage = async (req, res) => {
  try {
    const { sessionId, role, content, eventPlanningId } = req.body;

    if (!sessionId || !role || !content) {
      return res.status(400).json({
        success: false,
        message: 'sessionId, role, and content are required'
      });
    }

    // Find or create chat session
    let chatHistory = await ChatHistory.findOne({ sessionId });

    if (!chatHistory) {
      chatHistory = new ChatHistory({
        sessionId,
        messages: [],
        eventPlanningId
      });
    }

    // Add message
    chatHistory.messages.push({ role, content });
    chatHistory.lastMessageAt = new Date();
    chatHistory.updatedAt = new Date();

    if (eventPlanningId) {
      chatHistory.eventPlanningId = eventPlanningId;
    }

    await chatHistory.save();

    res.json({
      success: true,
      data: chatHistory
    });

  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving chat message',
      error: error.message
    });
  }
};

// Get chat history by session
export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const chatHistory = await ChatHistory.findOne({ sessionId })
      .populate('eventPlanningId');

    if (!chatHistory) {
      return res.json({
        success: true,
        data: { messages: [] }
      });
    }

    res.json({
      success: true,
      data: chatHistory
    });

  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting chat history',
      error: error.message
    });
  }
};

// Get all chat sessions
export const getAllChatSessions = async (req, res) => {
  try {
    const sessions = await ChatHistory.find()
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .select('sessionId lastMessageAt messages');

    res.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('Error getting chat sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting chat sessions',
      error: error.message
    });
  }
};

// Delete chat session
export const deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    await ChatHistory.deleteOne({ sessionId });

    res.json({
      success: true,
      message: 'Chat session deleted'
    });

  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting chat session',
      error: error.message
    });
  }
};
