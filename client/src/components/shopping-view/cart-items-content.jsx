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
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{cartItem?.title}</h2>
            <p className="text-sm text-slate-500">{cartItem?.category} • {cartItem?.brand}</p>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start gap-6">
          <img
            src={cartItem?.image}
            alt={cartItem?.title}
            className="w-20 h-20 object-contain bg-white rounded-lg shadow-md flex-shrink-0 border border-slate-200"
          />
          
          <div className="flex-1 space-y-4">
            {/* Badges */}
            <div className="flex items-center gap-2">
              {isOnSale && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                  <Tag className="w-4 h-4 inline mr-1" />
                  On Sale
                </span>
              )}
              {cartItem?.featured && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                  <Star className="w-4 h-4 inline mr-1" />
                  Featured
                </span>
              )}
            </div>

            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOnSale ? (
                  <>
                    <span className="text-xl text-red-600 font-bold">
                      ${salePrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-slate-500 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                      Save ${(originalPrice - salePrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-xl text-slate-800 font-bold">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-800">
                  ${totalPrice.toFixed(2)}
                </div>
                {savings > 0 && (
                  <div className="text-sm text-green-600 font-semibold">
                    You save ${savings.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 font-medium">Quantity:</span>
                <div className="flex items-center gap-2 bg-slate-50 rounded-full p-1">
                  <Button
                    variant="ghost"
                    className="h-10 w-10 rounded-full hover:bg-slate-200 transition-colors duration-300"
                    disabled={cartItem?.quantity === 1}
                    onClick={() => handleUpdateQuantity(cartItem, "minus")}
                  >
                    <Minus className="w-5 h-5 text-slate-600" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-slate-800 text-lg">
                    {cartItem?.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    className="h-10 w-10 rounded-full hover:bg-slate-200 transition-colors duration-300"
                    onClick={() => handleUpdateQuantity(cartItem, "plus")}
                  >
                    <Plus className="w-5 h-5 text-slate-600" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ShoppingCart className="w-4 h-4" />
                <span>Subtotal: ${(totalPrice / cartItem?.quantity).toFixed(2)} each</span>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => handleCartItemDelete(cartItem)}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg transition-colors duration-300 self-start"
            title="Remove from cart"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
