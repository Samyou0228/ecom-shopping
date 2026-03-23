import { Minus, Plus, Trash, Tag, Star, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  const isOnSale = cartItem?.salePrice > 0;
  const originalPrice = cartItem?.price;
  const salePrice = cartItem?.salePrice;
  const totalPrice = (isOnSale ? salePrice : originalPrice) * cartItem?.quantity;
  const savings = isOnSale ? (originalPrice - salePrice) * cartItem?.quantity : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="p-4 flex items-start gap-4">
        {/* Compact Image */}
        <div className="relative group">
          <img
            src={cartItem?.image}
            alt={cartItem?.title}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-white rounded-lg shadow-sm border border-slate-100 flex-shrink-0"
          />
          {isOnSale && (
            <span className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
              SALE
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="text-base font-bold text-slate-800 truncate leading-tight">
                {cartItem?.title}
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {cartItem?.category} • {cartItem?.brand}
              </p>
            </div>
            {/* Delete Button */}
            <button
              onClick={() => handleCartItemDelete(cartItem)}
              className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors duration-300 flex-shrink-0"
              title="Remove"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-2">
              {isOnSale ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600">₹{salePrice.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 line-through">₹{originalPrice.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <span className="text-lg font-bold text-slate-800">₹{originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="text-right">
              <span className="block text-lg font-extrabold text-slate-900">₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-white hover:shadow-sm"
                disabled={cartItem?.quantity === 1}
                onClick={() => handleUpdateQuantity(cartItem, "minus")}
              >
                <Minus className="w-3 h-3 text-slate-600" />
              </Button>
              <span className="w-8 text-center font-bold text-slate-800 text-sm">
                {cartItem?.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-white hover:shadow-sm"
                onClick={() => handleUpdateQuantity(cartItem, "plus")}
              >
                <Plus className="w-3 h-3 text-slate-600" />
              </Button>
            </div>

            <div className="text-[10px] text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md">
              Subtotal: ₹{(totalPrice / cartItem?.quantity).toFixed(2)}/unit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
