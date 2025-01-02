const express = require("express");
const router = express.Router();
const ReviewReport = require("../model/reviewReport");
const Product = require("../model/product");

// Tạo báo cáo đánh giá mới
router.post("/report-review", async (req, res) => {
  try {
    let {
      productId,
      reviewId,
      reporterId,
      reporterModel,
      reason,
      description,
    } = req.body;

    // Chuyển đổi 'Seller' thành 'Shop' nếu cần
    if (reporterModel === "Seller") {
      reporterModel = "Shop";
    }

    const report = new ReviewReport({
      productId,
      reviewId,
      reporterId,
      reporterModel,
      reason,
      description,
      status: "pending",
      createdAt: new Date(),
    });
    await report.save();
    res
      .status(201)
      .json({ message: "Báo cáo đánh giá đã được gửi thành công" });
  } catch (error) {
    console.error("Lỗi khi lưu báo cáo đánh giá:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
    }
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi xử lý báo cáo đánh giá" });
  }
});

// Lấy danh sách báo cáo đánh giá
router.get("/admin/review-reports", async (req, res) => {
  try {
    const reports = await ReviewReport.find().populate("reporterId");
    res.status(200).json(reports);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách báo cáo đánh giá:", error);
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi lấy danh sách báo cáo đánh giá" });
  }
});

// Cập nhật trạng thái báo cáo đánh giá
router.put("/review-report/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedReport = await ReviewReport.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedReport) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy báo cáo đánh giá" });
    }
    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái báo cáo đánh giá:", error);
    res.status(500).json({
      message: "Có lỗi xảy ra khi cập nhật trạng thái báo cáo đánh giá",
    });
  }
});

// Xóa đánh giá từ sản phẩm
router.delete("/review-report/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const report = await ReviewReport.findById(id);

    if (!report) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy báo cáo đánh giá" });
    }

    // Xóa review từ sản phẩm
    const product = await Product.findById(report.productId);
    if (product) {
      product.reviews = product.reviews.filter(
        (review) => review._id.toString() !== report.reviewId.toString()
      );
      await product.save();

      // Cập nhật trạng thái của báo cáo thành 'resolved'
      report.status = 'resolved';
      await report.save();

      res.status(200).json({ message: "Đánh giá đã được xóa khỏi sản phẩm và báo cáo đã được cập nhật" });
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    console.error("Lỗi khi xóa đánh giá:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi xóa đánh giá" });
  }
});

module.exports = router;
