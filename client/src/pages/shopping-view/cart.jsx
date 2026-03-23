import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { ShoppingBag, Trash2, ArrowRight, Sparkles } from "lucide-react";

function ShoppingCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id)).finally(() => setIsLoading(false));
    }
  }, [dispatch, user?.id]);

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

  const totalSavings =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce((sum, currentItem) => {
        if (currentItem?.salePrice > 0) {
          return (
            sum +
            (currentItem.price - currentItem.salePrice) * currentItem.quantity
          );
        }
        return sum;
      }, 0)
      : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Sparkles className="w-8 h-8 text-yellow-300" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent">
                  Your Shopping Cart
                </h1>
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>
              <p className="text-lg text-slate-200">Review your items and proceed to checkout</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full">
                <ShoppingBag className="w-6 h-6 text-yellow-300" />
                <div className="text-center">
                  <div className="text-2xl font-bold">{cartItems?.items?.length || 0}</div>
                  <div className="text-sm text-white/80">Items in Cart</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {cartItems && cartItems.items && cartItems.items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.items.map((item) => (
                <UserCartItemsContent
                  key={item?.productId || item?._id}
                  cartItem={item}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sticky top-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Order Summary</h2>
                    <p className="text-slate-600">Review your total</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-xl">₹{totalCartAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-semibold text-xl text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">Tax (8%)</span>
                    <span className="font-semibold text-xl">₹{(totalCartAmount * 0.08).toFixed(2)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-green-600 font-semibold">You're Saving</span>
                      <span className="font-semibold text-xl text-green-600">₹{totalSavings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-slate-800">Total</span>
                      <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        ₹{(totalCartAmount + totalCartAmount * 0.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={() => navigate("/shop/checkout")}
                  className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Button>

                {/* Continue Shopping */}
                <Button
                  variant="outline"
                  onClick={() => navigate("/shop/listing")}
                  className="w-full mt-4 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 text-lg py-3 rounded-xl"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    <span>Continue Shopping</span>
                  </div>
                </Button>

                {/* Payment Methods */}
                <div className="mt-6 text-center">
                  <p className="text-slate-500 text-sm mb-3">Secure checkout powered by</p>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <span>Razorpay</span>
                    <span>•</span>
                    <span>Visa</span>
                    <span>•</span>
                    <span>Mastercard</span>
                    <span>•</span>
                    <span>UPI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-slate-200 to-slate-300 p-12 rounded-3xl inline-block shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <ShoppingBag className="w-24 h-24 text-slate-400" />
              </div>
              <h3 className="text-3xl font-bold text-slate-600 mb-4">Your cart is empty</h3>
              <p className="text-slate-500 text-lg mb-8 max-w-md">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Button
                onClick={() => navigate("/shop/listing")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xl px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  <span>Start Shopping</span>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingCart;

