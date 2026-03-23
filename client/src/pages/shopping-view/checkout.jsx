import Address from "@/components/shopping-view/address";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { CreditCard, Truck, MapPin, Shield, Percent, CheckCircle, ShoppingBag, IndianRupee } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0;

  const cartImages =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.map((item) => item.image).filter(Boolean)
      : [];

  function handleInitiateRazorpayPayment() {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });

      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      totalAmount: totalCartAmount,
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      const payload = data?.payload;

      if (!payload?.success) {
        setIsPaymemntStart(false);
        toast({
          title: payload?.message || "Unable to start payment. Please try again.",
          variant: "destructive",
        });

        return;
      }

      if (!(window && window.Razorpay)) {
        setIsPaymemntStart(false);
        toast({
          title: "Payment SDK not loaded. Please refresh the page.",
          variant: "destructive",
        });

        return;
      }

      const options = {
        key: payload.key,
        amount: payload.amount,
        currency: payload.currency,
        name: "Ecommerce",
        description: "Order Payment",
        order_id: payload.razorpayOrderId,
        prefill: {
          name: user?.userName,
          email: user?.email,
        },
        notes: {
          address: `${currentSelectedAddress?.address}, ${currentSelectedAddress?.city}`,
        },
        theme: {
          color: "#000000",
        },
        handler: function (response) {
          axios
            .post("/api/shop/order/capture", {
              orderId: payload.orderId,
              razorpayOrderId: payload.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            .then((res) => {
              if (res.data.success) {
                toast({
                  title: "Payment successful!",
                });
                window.location.href = "/shop/payment-success";
              } else {
                setIsPaymemntStart(false);
                toast({
                  title: "Payment verification failed.",
                  variant: "destructive",
                });
              }
            })
            .catch(() => {
              setIsPaymemntStart(false);
              toast({
                title: "Payment confirmation failed.",
                variant: "destructive",
              });
            });
        },
        modal: {
          ondismiss: function () {
            setIsPaymemntStart(false);
          },
        },
      };

      const razorpayObject = new window.Razorpay(options);
      razorpayObject.open();
      setIsPaymemntStart(true);
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80"></div>
        {cartImages.length > 0 ? (
          <>
            <img
              src={cartImages[currentImageIndex]}
              className="h-full w-full object-cover object-center transition-opacity duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
        )}

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center gap-6 mb-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                <CreditCard className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2">Secure Checkout</h1>
                <p className="text-xl text-white/90">Complete your purchase safely and securely</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/80">
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4" />
                256-bit SSL Encryption
              </span>
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                PCI Compliant
              </span>
              <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Percent className="w-4 h-4" />
                Best Prices Guaranteed
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {cartImages.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 rounded-full p-4 text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
              onClick={() =>
                setCurrentImageIndex(
                  (prev) =>
                    (prev - 1 + cartImages.length) % cartImages.length
                )
              }
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 rounded-full p-4 text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
              onClick={() =>
                setCurrentImageIndex(
                  (prev) => (prev + 1) % cartImages.length
                )
              }
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
          {/* Address Section */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Delivery Address</h2>
                <p className="text-slate-600 text-lg">Choose your preferred delivery location</p>
              </div>
            </div>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Summary</h2>
                <p className="text-slate-600 text-lg">Review your items before payment</p>
              </div>
            </div>

            <div className="space-y-4">
              {cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items.map((item) => (
                  <UserCartItemsContent
                    key={item?.productId || item?._id}
                    cartItem={item}
                  />
                ))
                : (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-slate-200 to-slate-300 p-8 rounded-2xl inline-block">
                      <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-xl font-semibold text-slate-600 mb-2">Your cart is empty</p>
                      <p className="text-slate-500">Add some products to your cart to checkout</p>
                    </div>
                  </div>
                )}
            </div>

            {/* Order Summary Details */}
            <div className="mt-8 border-t border-slate-200 pt-6 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600 text-lg">Subtotal</span>
                <span className="font-semibold text-xl">₹{totalCartAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600 text-lg">Shipping</span>
                <span className="font-semibold text-xl text-green-600">FREE</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-600 text-lg">Tax (8%)</span>
                <span className="font-semibold text-xl">₹{(totalCartAmount * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center text-lg font-bold text-slate-800">
                  <span className="text-xl">Total</span>
                  <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    ₹{(totalCartAmount + totalCartAmount * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="mt-8">
              <Button
                onClick={handleInitiateRazorpayPayment}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white text-xl py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold disabled:transform-none disabled:cursor-not-allowed"
                disabled={isPaymentStart}
              >
                {isPaymentStart ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-lg">Processing Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4">
                    <CreditCard className="w-6 h-6" />
                    <span className="text-lg">Complete Payment</span>
                    <IndianRupee className="w-6 h-6" />
                  </div>
                )}
              </Button>

              {/* Payment Methods */}
              <div className="mt-6 text-center">
                <p className="text-slate-500 text-lg mb-4">Secure payment powered by Razorpay</p>
                <div className="flex items-center justify-center gap-4 text-base">
                  <span className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full font-medium">UPI</span>
                  <span className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full font-medium">Credit Card</span>
                  <span className="bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full font-medium">Debit Card</span>
                  <span className="bg-gradient-to-r from-slate-100 to-slate-200 px-4 py-2 rounded-full font-medium">Net Banking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
