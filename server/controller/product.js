const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const Order = require("../model/order");
const {
  isSellerAuthenticated,
  isAuthenticated,
  isAdminAuthenticated,
} = require("../middleware/auth");
const fs = require("fs");

// add product
router.post(
  "/add-product",
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
        const productData = req.body;
        productData.images = imageUrls;
        productData.shop = shop;
        productData.status = "pending";
        productData.isUsed = productData.isUsed === "true";

        // Xử lý dữ liệu phân loại
        if (productData.hasClassifications === "true") {
          productData.hasClassifications = true;
          productData.group1 = JSON.parse(productData.group1);
          if (productData.group2) {
            productData.group2 = JSON.parse(productData.group2);
          }

          // Xử lý classifications
          productData.classifications = JSON.parse(productData.classifications);
          productData.classifications.forEach((classification) => {
            classification.price = classification.price.replace(/\./g, "");
            classification.stock = Number(classification.stock);
            classification.percentageDiscount =
              Number(classification.percentageDiscount) || 0;
            classification.discountPrice =
              Number(classification.discountPrice) ||
              Number(classification.price);
          });

          // Xóa price, stock, percentageDiscount và discountPrice từ productData chính
          delete productData.price;
          delete productData.stock;
          delete productData.percentageDiscount;
          delete productData.discountPrice;
        } else {
          productData.hasClassifications = false;
          if (productData.price) {
            productData.price = productData.price.replace(/\./g, "");
          } else {
            productData.price = "";
          }
          if (productData.stock) {
            productData.stock = Number(productData.stock);
          } else {
            productData.stock = null;
          }
          productData.percentageDiscount =
            Number(productData.percentageDiscount) || 0;
          productData.discountPrice =
            Number(productData.discountPrice) || Number(productData.price) || 0;
        }

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// update product
router.put(
  "/update-product/:id",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        return next(new ErrorHandler("Không tìm thấy sản phẩm", 404));
      }

      const files = req.files;
      let imageUrls = product.images;

      if (files && files.length > 0) {
        // Xóa ảnh cũ nếu có ảnh mới được tải lên
        product.images.forEach((image) => {
          const filename = image;
          const filePath = `uploads/${filename}`;

          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
          });
        });

        // Thêm ảnh mới
        imageUrls = files.map((file) => `${file.filename}`);
      }

      const productData = req.body;
      productData.images = imageUrls;

      // Đặt trạng thái về "pending"
      productData.status = "pending";

      // Xử lý dữ liệu phân loại
      if (productData.hasClassifications === "true") {
        productData.hasClassifications = true;
        productData.group1 = JSON.parse(productData.group1);
        if (productData.group2) {
          productData.group2 = JSON.parse(productData.group2);
        }

        // Xử lý classifications
        productData.classifications = JSON.parse(productData.classifications);
        productData.classifications.forEach((classification) => {
          classification.price = classification.price.replace(/\./g, "");
          classification.stock = Number(classification.stock);
          classification.percentageDiscount =
            Number(classification.percentageDiscount) || 0;
          classification.discountPrice =
            Number(classification.discountPrice) ||
            Number(classification.price);
        });

        // Xóa price, stock, percentageDiscount và discountPrice từ productData chính
        delete productData.price;
        delete productData.stock;
        delete productData.percentageDiscount;
        delete productData.discountPrice;
      } else {
        productData.hasClassifications = false;
        if (productData.price) {
          productData.price = productData.price.replace(/\./g, "");
        } else {
          productData.price = "";
        }
        if (productData.stock) {
          productData.stock = Number(productData.stock);
        } else {
          productData.stock = null;
        }
        productData.percentageDiscount =
          Number(productData.percentageDiscount) || 0;
        productData.discountPrice =
          Number(productData.discountPrice) || Number(productData.price) || 0;
      }

      // Cập nhật thông tin danh mục
      if (productData.category) {
        productData.category = productData.category;
      }
      if (productData.subcategory) {
        productData.subcategory = productData.subcategory;
      }
      if (productData.subclassification) {
        productData.subclassification = productData.subclassification;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        productData,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      res.status(200).json({
        success: true,
        product: updatedProduct,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all products of shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const pendingProducts = await Product.find({
        shopId: req.params.id,
        status: "pending",
      }).sort({
        createdAt: -1,
      });
      const approvedProducts = await Product.find({
        shopId: req.params.id,
        status: "approved",
      }).sort({
        updatedAt: 1,
      });
      const rejectedProducts = await Product.find({
        shopId: req.params.id,
        status: "rejected",
      }).sort({
        updatedAt: 1,
      });

      const products = [
        ...pendingProducts,
        ...approvedProducts,
        ...rejectedProducts,
      ];

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get approved products of shop
router.get(
  "/get-approved-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const approvedProducts = await Product.find({
        shopId: req.params.id,
        status: "approved",
      }).sort({
        updatedAt: 1,
      });

      res.status(200).json({
        success: true,
        products: approvedProducts,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get a single approved product of shop
router.get(
  "/get-approved-product-shop/:shopId/:productId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { shopId, productId } = req.params;
      const approvedProduct = await Product.findOne({
        _id: productId,
        shopId: shopId,
        status: "approved",
      });

      if (!approvedProduct) {
        return next(new ErrorHandler("Product not found or not approved", 404));
      }

      res.status(200).json({
        success: true,
        product: approvedProduct,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// delete product
router.delete(
  "/delete-product/:id",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const productData = await Product.findById(productId);

      productData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Lỗi khi xóa tập tin" });
          }
        });
      });

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(new ErrorHandler("Không tìm thấy sản phẩm", 500));
      }

      res.status(201).json({
        success: true,
        message: "Sản phẩm đã được xóa thành công",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all approved products that are not used or don't have isUsed field
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({
        status: "approved",
        $or: [{ isUsed: false }, { isUsed: { $exists: false } }],
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all approved used products
router.get(
  "/get-all-used-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({
        status: "approved",
        isUsed: true,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review a product
router.put(
  "/create-new-review-product",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, createdAt, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let average = 0;

      product.reviews.forEach((rev) => {
        average += rev.rating;
      });

      product.ratings = average / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        {
          $set: {
            "cart.$[elem].isReviewed": true,
          },
        },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(201).json({
        success: true,
        message: "Đánh giá đã được thêm thành công",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// all products for admin
router.get(
  "/admin-get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const pendingProducts = await Product.find({ status: "pending" }).sort({
        createdAt: -1,
      });
      const approvedProducts = await Product.find({ status: "approved" }).sort({
        updatedAt: 1,
      });
      const rejectedProducts = await Product.find({ status: "rejected" }).sort({
        updatedAt: 1,
      });

      const products = [
        ...pendingProducts,
        ...approvedProducts,
        ...rejectedProducts,
      ];

      res.status(200).json({ success: true, products });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.put(
  "/update-status/:id",
  catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Không tìm thấy sản phẩm", 404));
    }

    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return next(new ErrorHandler("Trạng thái không hợp lệ", 400));
    }

    product.status = status;
    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  })
);

// add product for admin
router.post(
  "/admin-add-product",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const files = req.files;
      const imageUrls = files.map((file) => `${file.filename}`);
      const productData = req.body;
      productData.images = imageUrls;

      if (req.user && req.user._id) {
        productData.userId = req.user._id;
      }

      // Tìm hoặc tạo shop eCommUnity
      let shop = await Shop.findOne({ name: "eCommUnity" });
      if (!shop) {
        shop = new Shop({ name: "eCommUnity" });
        await shop.save({ validateBeforeSave: false });
      }

      productData.shopId = shop._id;
      productData.shop = shop;
      productData.status = "approved"; // Admin-added products are automatically approved

      // Xử lý dữ liệu phân loại
      if (productData.hasClassifications === "true") {
        productData.hasClassifications = true;
        productData.group1 = JSON.parse(productData.group1);
        if (productData.group2) {
          productData.group2 = JSON.parse(productData.group2);
        }

        productData.classifications = JSON.parse(productData.classifications);
        productData.classifications.forEach((classification) => {
          classification.price = classification.price.replace(/\./g, "");
          classification.stock = Number(classification.stock);
          classification.percentageDiscount =
            Number(classification.percentageDiscount) || 0;
          classification.discountPrice =
            Number(classification.discountPrice) ||
            Number(classification.price);
        });

        delete productData.price;
        delete productData.stock;
        delete productData.percentageDiscount;
        delete productData.discountPrice;
      } else {
        productData.hasClassifications = false;
        productData.price = productData.price
          ? productData.price.replace(/\./g, "")
          : "";
        productData.stock = productData.stock
          ? Number(productData.stock)
          : null;
        productData.percentageDiscount =
          Number(productData.percentageDiscount) || 0;
        productData.discountPrice =
          Number(productData.discountPrice) || Number(productData.price) || 0;
      }

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all products of admin
router.get(
  "/get-all-products-admin",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Tìm shop eCommUnity
      const eCommUnityShop = await Shop.findOne({ name: "eCommUnity" });

      if (!eCommUnityShop) {
        return next(new ErrorHandler("eCommUnity shop not found", 404));
      }

      const products = await Product.find({ shopId: eCommUnityShop._id }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;
