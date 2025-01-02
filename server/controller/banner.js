// routes/banner.js
const express = require("express");
const router = express.Router();
const Banner = require("../model/banner");
const multer = require("multer");
const path = require("path");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");

// Thêm banner mới
router.post(
  "/admin-add-banner",
  upload.single("image"),
  catchAsyncErrors(async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Không có hình ảnh được tải lên" });
      }

      const newBanner = new Banner({
        image: req.file.filename,
        title: req.body.title,
        subtitle: req.body.subtitle,
        link: req.body.link,
        order: req.body.order,
        isActive: req.body.isActive === "true",
        type: req.body.type,
        popupFrequency: req.body.popupFrequency,
      });

      await newBanner.save();
      res.status(201).json(newBanner);
    } catch (error) {
      console.error("Lỗi khi thêm banner:", error);
      res.status(400).json({ message: error.message });
    }
  })
);

// Lấy danh sách banner
router.get(
  "/admin-get-all-banners",
  catchAsyncErrors(async (req, res) => {
    try {
      const banners = await Banner.find().sort("order");
      res.json(banners);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

// Lấy danh sách banner active cho homepage (carousel)
router.get(
  "/active-banners-homepage",
  catchAsyncErrors(async (req, res) => {
    try {
      const banners = await Banner.find({
        isActive: true,
        type: "carousel",
      }).sort("order");
      res.json(banners);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

// Lấy banner popup active
router.get(
  "/active-popup-banner",
  catchAsyncErrors(async (req, res) => {
    try {
      const popupBanner = await Banner.findOne({
        isActive: true,
        type: "popup",
      });
      res.json(popupBanner);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

// Cập nhật banner
router.put(
  "/admin-update-banner/:id",
  upload.single("image"),
  catchAsyncErrors(async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID banner không hợp lệ" });
      }

      const updateData = {
        title: req.body.title,
        subtitle: req.body.subtitle,
        link: req.body.link,
        order: req.body.order,
        isActive: req.body.isActive === true || req.body.isActive === "true",
        type: req.body.type,
        popupFrequency: req.body.popupFrequency,
      };
      if (req.file) {
        updateData.image = req.file.filename;
      }

      const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedBanner) {
        return res.status(404).json({ message: "Không tìm thấy banner" });
      }

      res.json(updatedBanner);
    } catch (error) {
      console.error("Error updating banner:", error);
      res.status(400).json({ message: error.message });
    }
  })
);

// Xóa banner
router.delete(
  "/admin-delete-banner/:id",
  catchAsyncErrors(async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID banner không hợp lệ" });
      }

      const deletedBanner = await Banner.findByIdAndDelete(id);
      if (!deletedBanner) {
        return res.status(404).json({ message: "Không tìm thấy banner" });
      }
      res.json({ message: "Đã xóa banner thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

module.exports = router;
