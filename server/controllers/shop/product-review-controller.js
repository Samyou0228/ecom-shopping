const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue, orderId } =
      req.body;

    // 1. Get all delivered orders for this user and product
    const deliveredOrders = await Order.find({
      userId,
      "cartItems.productId": productId,
      orderStatus: "delivered",
    });

    if (!deliveredOrders.length) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    // 2. Get all existing reviews for this user and product
    const existingReviews = await ProductReview.find({
      productId,
      userId,
    });

    // 3. Logic: If user specifically clicked "Submit Rating" from an Order Details view, 
    // we should check that specific orderId.
    if (orderId) {
      const isAlreadyReviewedThisOrder = existingReviews.some(rev => rev.orderId === orderId);
      if (isAlreadyReviewedThisOrder) {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed this purchase!",
        });
      }
    } else {
      // If they are on the general Product Page, they can review if 
      // Total Delivered Purchases > Total Reviews
      if (existingReviews.length >= deliveredOrders.length) {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed all your purchases of this product!",
        });
      }
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
      orderId: orderId || deliveredOrders[0]._id, // Associate with an order if none provided
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
