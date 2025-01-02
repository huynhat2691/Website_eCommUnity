const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const {
  isSellerAuthenticated,
  isAuthenticated,
} = require("../middleware/auth");
const router = express.Router();

// create a new conversation
router.post(
  "/create-new-conversation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { userId, sellerId } = req.body;

      const conversation = await Conversation.create({
        members: [userId, sellerId],
        groupTitle: `${userId}_${sellerId}`, // Use a consistent format for groupTitle
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Check if conversation exists
router.get(
  "/check-conversation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { userId, sellerId } = req.query;

      const conversation = await Conversation.findOne({
        members: { $all: [userId, sellerId] },
      });

      if (conversation) {
        res.status(200).json({
          success: true,
          exists: true,
          conversation,
        });
      } else {
        res.status(200).json({
          success: true,
          exists: false,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get seller conversations
router.get(
  "/get-all-seller-conversation/:id",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// get user conversations
router.get(
  "/get-all-user-conversation/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// update the last message
router.put(
  "/update-last-message/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;

      const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
        lastMessage,
        lastMessageId,
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// delete a conversation
router.delete(
  "/delete-conversation/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversation = await Conversation.findById(req.params.id);

      if (!conversation) {
        return next(new ErrorHandler("Không tìm thấy cuộc trò chuyện", 404));
      }

      await Conversation.deleteOne({ _id: req.params.id });

      res.status(200).json({
        success: true,
        message: "Cuộc trò chuyện đã được xóa thành công",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get conversation by id
router.get(
  "/get-conversation-by-id/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversation = await Conversation.findById(req.params.id);

      if (!conversation) {
        return next(new ErrorHandler("Không tìm thấy cuộc trò chuyện", 404));
      }

      // Check if the user is a member of the conversation
      if (!conversation.members.includes(req.user._id)) {
        return next(new ErrorHandler("Unauthorized", 403));
      }

      res.status(200).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
