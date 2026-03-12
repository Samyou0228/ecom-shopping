import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useDispatch, useSelector } from "react-redux";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useToast } from "../ui/use-toast";

function OrderRatingForm({ productId, orderId }) {
  const [rating, setRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleSubmitReview() {
    if (!user?.id) {
      toast({
        title: "Please login to add review",
        variant: "destructive"
      });
      return;
    }

    dispatch(
      addReview({
        productId,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
        orderId, // Pass order ID for tracking
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productId));
        toast({
          title: "Review submitted successfully!",
        });
      } else {
        toast({
          title: data?.payload?.message || "Failed to submit review",
          variant: "destructive"
        });
      }
    }).catch((error) => {
      toast({
        title: "Network error - please try again",
        variant: "destructive"
      });
    });
  }

  return (
    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">Rate this product</h3>
      <div className="flex gap-2 mb-4">
        <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
      </div>
      <Input
        value={reviewMsg}
        onChange={(e) => setReviewMsg(e.target.value)}
        placeholder="Share your experience (optional)..."
        className="mb-4"
      />
      <Button 
        onClick={handleSubmitReview} 
        disabled={rating === 0}
        className="w-full"
      >
        Submit Rating
      </Button>
    </div>
  );

  return (
    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
      <h3 className="text-lg font-semibold mb-2 text-green-800">Thank you for your rating!</h3>
      <p className="text-sm text-green-700 mb-4">Your review has been submitted successfully.</p>
      <Button variant="outline" onClick={() => {
        setRating(0);
        setReviewMsg("");
      }}>
        Rate another product
      </Button>
    </div>
  );
}

export default OrderRatingForm;
