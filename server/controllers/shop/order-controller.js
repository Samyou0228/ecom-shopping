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

    const order = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "created",
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    });

    try {
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`,
      });

      order.paymentId = razorpayOrder.id;

      await order.save();

      return res.status(201).json({
        success: true,
        orderId: order._id,
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

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = razorpayPaymentId;
    order.payerId = "";

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
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
