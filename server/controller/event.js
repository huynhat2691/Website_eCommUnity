const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const Event = require("../model/event");
const {
  isSellerAuthenticated,
  isAuthenticated,
  isAdminAuthenticated,
} = require("../middleware/auth");
const fs = require("fs");

// add event
router.post(
  "/add-event",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Không tìm thấy ID shop", 404));
      } else {
        const files = req.files;
        const imageUrls = files.map((file) => `${file.filename}`);
        const eventData = req.body;
        eventData.images = imageUrls;
        eventData.shop = shop;

        // Xử lý dữ liệu phân loại
        if (eventData.hasClassifications === "true") {
          eventData.hasClassifications = true;
          eventData.group1 = JSON.parse(eventData.group1);
          if (eventData.group2) {
            eventData.group2 = JSON.parse(eventData.group2);
          }

          // Xử lý classifications
          eventData.classifications = JSON.parse(eventData.classifications);
          eventData.classifications.forEach((classification) => {
            classification.price = classification.price.replace(/\./g, "");
            classification.stock = Number(classification.stock);
            classification.percentageDiscount =
              Number(classification.percentageDiscount) || 0;
            classification.discountPrice =
              Number(classification.discountPrice) ||
              Number(classification.price);
          });

          // Xóa price, stock, percentageDiscount và discountPrice từ eventData chính
          delete eventData.price;
          delete eventData.stock;
          delete eventData.percentageDiscount;
          delete eventData.discountPrice;
        } else {
          eventData.hasClassifications = false;
          if (eventData.price) {
            eventData.price = eventData.price.replace(/\./g, "");
          } else {
            eventData.price = "";
          }
          if (eventData.stock) {
            eventData.stock = Number(eventData.stock);
          } else {
            eventData.stock = null;
          }
          eventData.percentageDiscount =
            Number(eventData.percentageDiscount) || 0;
          eventData.discountPrice =
            Number(eventData.discountPrice) || Number(eventData.price) || 0;
        }

        const event = await Event.create(eventData);

        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();

    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get all events of shop
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// delete event
router.delete(
  "/delete-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const eventData = await Event.findById(productId);

      eventData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Lỗi khi xóa tập tin" });
          }
        });
      });

      const event = await Event.findByIdAndDelete(productId);

      if (!event) {
        return next(new ErrorHandler("Không tìm thấy event", 500));
      }

      res.status(201).json({
        success: true,
        message: "Event đã xóa thành công",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// all events for admin
router.get(
  "/admin-get-all-events",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });

      res.status(201).json({ success: true, events });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// add event for admin
router.post(
  "/admin-add-event",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const files = req.files;
      const imageUrls = files.map((file) => `${file.filename}`);
      const eventData = req.body;
      eventData.images = imageUrls;

      if (req.user && req.user._id) {
        eventData.userId = req.user._id;
      }

      // Tìm hoặc tạo shop eCommUnity
      let shop = await Shop.findOne({ name: "eCommUnity" });
      if (!shop) {
        shop = new Shop({ name: "eCommUnity" });
        await shop.save({ validateBeforeSave: false });
      }

      eventData.shopId = shop._id;
      eventData.shop = shop;
      eventData.status = "approved"; // Admin-added events are automatically approved

      // Xử lý dữ liệu phân loại
      if (eventData.hasClassifications === "true") {
        eventData.hasClassifications = true;
        eventData.group1 = JSON.parse(eventData.group1);
        if (eventData.group2) {
          eventData.group2 = JSON.parse(eventData.group2);
        }

        eventData.classifications = JSON.parse(eventData.classifications);
        eventData.classifications.forEach((classification) => {
          classification.price = classification.price.replace(/\./g, "");
          classification.stock = Number(classification.stock);
          classification.percentageDiscount =
            Number(classification.percentageDiscount) || 0;
          classification.discountPrice =
            Number(classification.discountPrice) ||
            Number(classification.price);
        });

        delete eventData.price;
        delete eventData.stock;
        delete eventData.percentageDiscount;
        delete eventData.discountPrice;
      } else {
        eventData.hasClassifications = false;
        eventData.price = eventData.price
          ? eventData.price.replace(/\./g, "")
          : "";
        eventData.stock = eventData.stock ? Number(eventData.stock) : null;
        eventData.percentageDiscount =
          Number(eventData.percentageDiscount) || 0;
        eventData.discountPrice =
          Number(eventData.discountPrice) || Number(eventData.price) || 0;
      }

      const event = await Event.create(eventData);

      res.status(201).json({
        success: true,
        event,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all events of admin
router.get(
  "/get-all-events-admin",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Tìm shop eCommUnity
      const eCommUnityShop = await Shop.findOne({ name: "eCommUnity" });

      if (!eCommUnityShop) {
        return next(new ErrorHandler("eCommUnity shop not found", 404));
      }

      const events = await Event.find({ shopId: eCommUnityShop._id }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;
