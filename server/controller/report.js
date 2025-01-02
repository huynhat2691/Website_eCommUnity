const express = require("express");
const router = express.Router();
const Report = require("../model/report");

// Tạo báo cáo mới
router.post("/report-product", async (req, res) => {
  try {
    const { productId, userId, reason, description } = req.body;
    const report = new Report({
      productId,
      userId,
      reason,
      description,
      status: "pending",
      createdAt: new Date(),
    });
    await report.save();
    res.status(201).json({ message: "Báo cáo đã được gửi thành công" });
  } catch (error) {
    console.error("Lỗi khi lưu báo cáo:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi xử lý báo cáo" });
  }
});

// Lấy danh sách báo cáo
router.get("/admin/reports", async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("productId")
      .populate("userId");
    res.status(200).json(reports);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách báo cáo:", error);
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi lấy danh sách báo cáo" });
  }
});

// Cập nhật trạng thái báo cáo
router.put("/report-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedReport) {
      return res.status(404).json({ message: "Không tìm thấy báo cáo" });
    }
    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái báo cáo:", error);
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi cập nhật trạng thái báo cáo" });
  }
});

// Xóa báo cáo
router.delete("/report-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);
    if (!deletedReport) {
      return res.status(404).json({ message: "Không tìm thấy báo cáo" });
    }
    res.status(200).json({ message: "Báo cáo đã được xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa báo cáo:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi xóa báo cáo" });
  }
});

module.exports = router;
