import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Package, Sparkles, ArrowRight } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-white/80 text-lg">Thank you for your purchase</p>
          </div>

          {/* Content */}
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Order Confirmed</h3>
                  <p className="text-sm text-slate-600">Your order has been placed successfully</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">What's Next?</h3>
                  <p className="text-sm text-slate-600">Check your order status in your account</p>
                </div>
              </div>

              <Button 
                onClick={() => navigate("/shop/account")}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>View My Orders</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>

              <Button 
                variant="outline"
                onClick={() => navigate("/shop/listing")}
                className="w-full border-2 border-slate-200 hover:bg-slate-50 text-slate-700 text-lg py-3 rounded-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Continue Shopping</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
