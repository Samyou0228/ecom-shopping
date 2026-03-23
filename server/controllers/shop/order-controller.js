const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      totalAmount,
      cartId,
    } = req.body;

    if (!userId || !cartItems || !cartItems.length || !addressInfo || !cartId) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    // Group items by sellerId
    const itemsWithSellers = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          ...item,
          sellerId: product.seller.toString(),
        };
      })
    );

    const groupedBySeller = itemsWithSellers.reduce((acc, item) => {
      if (!acc[item.sellerId]) {
        acc[item.sellerId] = [];
      }
      acc[item.sellerId].push(item);
      return acc;
    }, {});

    try {
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`,
      });

      const orders = [];
      for (const sellerId in groupedBySeller) {
        const sellerItems = groupedBySeller[sellerId];
        const sellerTotalAmount = sellerItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        console.log(`Creating order for seller ${sellerId} with amount ${sellerTotalAmount}`);

        const newOrder = new Order({
          userId,
          sellerId,
          cartId,
          cartItems: sellerItems,
          addressInfo: {
            ...addressInfo,
            userName: req.user.userName,
            email: req.user.email,
          },
          orderStatus: "pending",
          paymentMethod: "razorpay",
          paymentStatus: "created",
          totalAmount: sellerTotalAmount,
          orderDate: new Date(),
          orderUpdateDate: new Date(),
          paymentId: razorpayOrder.id, // Storing Razorpay Order ID
          payerId: "",
        });

        await newOrder.save();
        orders.push(newOrder);
      }

      return res.status(201).json({
        success: true,
        orderId: orders[0]._id, // Sending first sub-order ID for tracking
        subOrderIds: orders.map(o => o._id),
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      const message =
        error.error?.description ||
        error.message ||
        "Error while creating payment order";

      console.log(message);

      if (error.statusCode === 401) {
        return res.status(200).json({
          success: false,
          message: "Razorpay authentication failed. Please update API keys.",
        });
      }

      return res.status(500).json({
        success: false,
        message,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment data",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Find all orders linked to this Razorpay Order ID
    const orders = await Order.find({ paymentId: razorpayOrderId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Orders not found",
      });
    }

    for (const order of orders) {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = razorpayPaymentId; // Update with actual payment ID
      order.payerId = "";

      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);
        if (product) {
          product.totalStock -= item.quantity;
          await product.save();
        }
      }
      await order.save();
    }

    // Delete cart using cartId from the first order
    const getCartId = orders[0].cartId;
    await Cart.findByIdAndDelete(getCartId);

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: orders[0], // Return one of the orders for UI consistency
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { sort } = req.query;

    let sortObj = { orderDate: -1 };
    if (sort === "orderDate:-1") {
      sortObj.orderDate = -1;
    }

    const orders = await Order.find({ userId }).sort(sortObj);

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // Enrich cartItems with isReviewed flag
    const cartItemsWithReviewStatus = await Promise.all(
      order.cartItems.map(async (item) => {
        const review = await ProductReview.findOne({
          orderId: order._id,
          productId: item.productId,
        });
        return {
          ...item._doc,
          isReviewed: !!review,
        };
      })
    );

    const enrichedOrder = {
      ...order._doc,
      cartItems: cartItemsWithReviewStatus,
    };

    res.status(200).json({
      success: true,
      data: enrichedOrder,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
