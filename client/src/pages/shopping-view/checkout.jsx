import Address from "@/components/shopping-view/address";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

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
            .post("http://localhost:5000/api/shop/order/capture", {
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
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden bg-muted">
        {cartImages.length > 0 ? (
          <>
            <img
              src={cartImages[currentImageIndex]}
              className="h-full w-full object-cover object-center"
            />
            {cartImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-3 py-1 text-sm"
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) =>
                        (prev - 1 + cartImages.length) % cartImages.length
                    )
                  }
                >
                  {"<"}
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-3 py-1 text-sm"
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev + 1) % cartImages.length
                    )
                  }
                >
                  {">"}
                </button>
              </>
            )}
          </>
        ) : null}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent
                  key={item?.productId || item?._id}
                  cartItem={item}
                />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiateRazorpayPayment} className="w-full">
              {isPaymentStart
                ? "Processing Payment..."
                : "Pay with Razorpay (UPI / Cards)"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
