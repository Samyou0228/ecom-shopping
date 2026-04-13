import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const isLoading = useSelector((state) => state.adminOrder.isLoading);

  // console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 h-32">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
                    <div className="text-slate-500 font-medium">Loading orders...</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                <TableRow key={orderItem?._id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium text-slate-700">{orderItem?._id}</TableCell>
                  <TableCell>
                    <div className="flex -space-x-3 overflow-hidden">
                      {orderItem?.cartItems && orderItem?.cartItems.length > 0 ? (
                        orderItem.cartItems.slice(0, 3).map((item, index) => (
                          <div 
                            key={index}
                            className="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden bg-slate-100 border border-slate-200 shadow-sm"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 border border-slate-200">
                          N/A
                        </div>
                      )}
                      {orderItem?.cartItems && orderItem?.cartItems.length > 3 && (
                        <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-slate-100 text-[10px] font-medium text-slate-600 border border-slate-200">
                          +{orderItem.cartItems.length - 3}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 capitalize ${orderItem?.orderStatus === "confirmed"
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-slate-900 hover:bg-slate-800"
                        }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">₹{orderItem?.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all font-medium"
                        onClick={() =>
                          handleFetchOrderDetails(orderItem?._id)
                        }
                      >
                        View Details
                      </Button>
                      <AdminOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
              : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="text-slate-400 font-medium">No orders found</div>
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
