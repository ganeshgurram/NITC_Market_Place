const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');

// Get all conversations for a user
router.get('/conversations', auth, async (req, res) => {
  try {
    // Get all unique conversation IDs involving this user
    const messages = await Message.find({
      $or: [
        { sender: req.userId },
        { receiver: req.userId }
      ]
    })
    .populate('sender', 'name rating')
    .populate('receiver', 'name rating')
    .populate('itemId', 'title images')
    .sort({ createdAt: -1 });

    // Group by conversation and get latest message
    const conversationsMap = new Map();
    
    messages.forEach(message => {
      const convId = message.conversationId;
      if (!conversationsMap.has(convId)) {
        conversationsMap.set(convId, {
          conversationId: convId,
          otherUser: message.sender._id.toString() === req.userId.toString() 
            ? message.receiver 
            : message.sender,
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          item: message.itemId,
          unreadCount: 0
        });
      }
      
      // Count unread messages
      if (message.receiver._id.toString() === req.userId.toString() && !message.isRead) {
        conversationsMap.get(convId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Error fetching conversations', message: error.message });
  }
});

// Get messages in a conversation
router.get('/conversation/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ 
      conversationId: req.params.conversationId 
    })
    .populate('sender', 'name rating')
    .populate('receiver', 'name rating')
    .populate('itemId', 'title images')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { 
        conversationId: req.params.conversationId,
        receiver: req.userId,
        isRead: false
      },
      { isRead: true }
    );

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages', message: error.message });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content, itemId } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver and content are required' });
    }

    // Create conversation ID (always use smaller ID first for consistency)
    const conversationId = [req.userId.toString(), receiverId].sort().join('_');

    const message = new Message({
      conversationId,
      sender: req.userId,
      receiver: receiverId,
      content,
      itemId: itemId || undefined
    });

    await message.save();
    await message.populate('sender', 'name rating');
    await message.populate('receiver', 'name rating');
    if (itemId) {
      await message.populate('itemId', 'title images');
    }

    res.status(201).json({ 
      message: 'Message sent successfully',
      data: message 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error sending message', message: error.message });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.userId,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Error fetching unread count', message: error.message });
  }
});

// Mark conversation as read
router.put('/conversation/:conversationId/read', auth, async (req, res) => {
  try {
    await Message.updateMany(
      { 
        conversationId: req.params.conversationId,
        receiver: req.userId,
        isRead: false
      },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Error marking messages as read', message: error.message });
  }
});

module.exports = router;
