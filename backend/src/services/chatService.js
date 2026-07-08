import ChatMessage from '../models/ChatMessage.js';
import Conversation from '../models/Conversation.js';
import logger from '../utils/logger.js';

export const createConversationService = async (conversationData, userId) => {
  try {
    if (conversationData.isGroup) {
      const conversation = new Conversation({
        name: conversationData.name,
        isGroup: true,
        description: conversationData.description || '',
        avatar: conversationData.avatar || null,
        participants: conversationData.participants || [userId],
        createdBy: userId,
      });

      await conversation.save();
      await conversation.populate('participants', 'firstName lastName email avatar');

      logger.info(`Group conversation created: ${conversation.name}`);

      return conversation;
    } else {
      const participantId = conversationData.participants[0];

      let conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [userId, participantId] },
      });

      if (conversation) {
        return conversation;
      }

      conversation = new Conversation({
        isGroup: false,
        participants: [userId, participantId],
        createdBy: userId,
      });

      await conversation.save();
      await conversation.populate('participants', 'firstName lastName email avatar');

      logger.info(`Direct message conversation created`);

      return conversation;
    }
  } catch (error) {
    logger.error(`Create conversation error: ${error.message}`);
    throw error;
  }
};

export const sendMessageService = async (messageData, userId) => {
  try {
    const conversation = await Conversation.findById(messageData.conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (!conversation.participants.includes(userId)) {
      throw new Error('Unauthorized to send message');
    }

    const message = new ChatMessage({
      content: messageData.content,
      conversation: messageData.conversationId,
      sender: userId,
      attachments: messageData.attachments || [],
      mentions: messageData.mentions || [],
    });

    await message.save();
    await message.populate('sender', 'firstName lastName email avatar');

    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    logger.info(`Message sent in conversation: ${messageData.conversationId}`);

    return message;
  } catch (error) {
    logger.error(`Send message error: ${error.message}`);
    throw error;
  }
};

export const getConversationMessagesService = async (conversationId, userId) => {
  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (!conversation.participants.includes(userId)) {
      throw new Error('Unauthorized to view messages');
    }

    const messages = await ChatMessage.find({ conversation: conversationId })
      .populate('sender', 'firstName lastName email avatar')
      .populate('mentions', 'firstName lastName email avatar')
      .sort({ createdAt: 1 });

    return messages;
  } catch (error) {
    logger.error(`Get messages error: ${error.message}`);
    throw error;
  }
};

export const getUserConversationsService = async (userId) => {
  try {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate('participants', 'firstName lastName email avatar')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    return conversations;
  } catch (error) {
    logger.error(`Get conversations error: ${error.message}`);
    throw error;
  }
};

export const markMessagesAsReadService = async (conversationId, userId) => {
  try {
    const messages = await ChatMessage.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId },
        readBy: { $ne: userId },
      },
      {
        $push: { readBy: userId },
      }
    );

    logger.info(`Messages marked as read in conversation: ${conversationId}`);

    return messages;
  } catch (error) {
    logger.error(`Mark as read error: ${error.message}`);
    throw error;
  }
};