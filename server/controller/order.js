const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {
  isAuthenticated,
  isSellerAuthenticated,
  isAdminAuthenticated,
} = require("../middleware/auth");
const Order = require("../model/order");
const Product = require("../model/product");
const Shop = require("../model/shop");
const Event = require("../model/event");

// create new order
router.post(
  "/create-orders",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { orders, user } = req.body;

      if (!orders || !Array.isArray(orders) || orders.length === 0) {
        return next(new ErrorHandler("Invalid order data", 400));
      }

      const createdOrders = [];

      for (const orderData of orders) {
        const { shopId, items, totalPrice, shippingAddress, paymentInfo } =
          orderData;

        if (
          !shopId ||
          !items ||
          !totalPrice ||
          !shippingAddress ||
          !paymentInfo
        ) {
          return next(new ErrorHandler("Missing required order fields", 400));
        }

        // Định dạng totalPrice
        const formattedTotalPrice = Number(totalPrice).toLocaleString("vi-VN");

        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice: formattedTotalPrice,
          paymentInfo,
          shopId,
        });

        createdOrders.push(order);
      }

      res.status(201).json({
        success: true,
        orders: createdOrders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(201).json({ success: true, orders });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of shop
router.get(
  "/get-all-seller-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(201).json({ success: true, orders });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status of shop
router.put(
  "/update-order-seller-status/:id",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Không tìm thấy đơn hàng", 400));
      }

      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(async (o) => {
          await updateItem(o._id, o.quantity);
        });
      }

      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Success";

        // Chuyển đổi totalPrice từ string sang number
        const totalPriceNumber = parseFloat(
          order.totalPrice.replace(/[.,]/g, "")
        );

        if (isNaN(totalPriceNumber) || !isFinite(totalPriceNumber)) {
          return next(
            new ErrorHandler("Giá trị tổng đơn hàng không hợp lệ", 400)
          );
        }

        const serviceCharge = totalPriceNumber * 0.04;
        const amountToAdd = totalPriceNumber - serviceCharge;

        await updateSellerInfo(amountToAdd.toString());
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({ success: true, order });

      async function updateItem(id, quantity) {
        const item = (await Product.findById(id)) || (await Event.findById(id));

        if (!item) {
          throw new Error("Item not found");
        }

        item.stock -= quantity;
        item.sold_out += quantity;

        await item.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);

        if (isNaN(parseFloat(amount)) || !isFinite(parseFloat(amount))) {
          throw new Error("Số tiền không hợp lệ");
        }

        // Chuyển đổi chuỗi thành số nguyên (đơn vị là xu)
        const currentBalanceCents = BigInt(
          Math.round(parseFloat(seller.availableBalance) * 100)
        );
        const amountToAddCents = BigInt(Math.round(parseFloat(amount) * 100));
        const newBalanceCents = currentBalanceCents + amountToAddCents;

        // Chuyển đổi lại thành chuỗi với 2 số thập phân
        seller.availableBalance = Number(newBalanceCents) / 100;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// refund order
router.put(
  "/refund-order/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Không tìm thấy đơn hàng", 400));
      }

      order.status = req.body.status;

      if (req.body.status === "Refund Requested") {
        // Thêm logic xử lý khi yêu cầu hoàn tiền được tạo
        order.refundRequestedAt = Date.now();
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Yêu cầu hoàn tiền đơn hàng thành công",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// seller accept refund order
router.put(
  "/order-refund-success/:id",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Không tìm thấy đơn hàng", 400));
      }

      order.status = req.body.status;

      if (req.body.status === "Refund Success") {
        order.refundedAt = Date.now();
        order.cart.forEach(async (o) => {
          await updateItem(o._id, o.quantity);
        });
        await updateSellerInfo(order.totalPrice);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Đơn hàng hoàn tiền thành công",
      });

      async function updateItem(id, quantity) {
        const item = (await Product.findById(id)) || (await Event.findById(id));

        if (!item) {
          throw new Error("Item not found");
        }

        item.stock += quantity;
        item.sold_out -= quantity;

        await item.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);

        seller.availableBalance -= amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// cancel order
router.put(
  "/cancel-order/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Không tìm thấy đơn hàng", 404));
      }

      if (order.status !== "Processing") {
        return next(new ErrorHandler("Không thể huỷ đơn hàng này", 400));
      }

      order.status = "Cancelled";
      await order.save();

      res.status(200).json({
        success: true,
        message: "Đơn hàng đã được huỷ thành công",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders for admin
router.get(
  "/admin-get-all-orders",
  isAuthenticated,
  isAdminAuthenticated("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });

      res.status(201).json({ success: true, orders });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all admin orders
router.get(
  "/get-all-admin-orders",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shop.name": "eCommUnity",
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({ success: true, orders });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
