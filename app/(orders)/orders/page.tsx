"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import dayjs from "dayjs";
import {
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Search,
  TicketX,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { OrderDetailsDialog } from "../_Components/OrderDialog";

interface PaymentDetail {
  method: string;
  trxId: string;
  accNo: string;
  amount: number;
  _id?: string;
}

export default function Orders() {
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchOrder, setSearchOrder] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<
    "Accepted" | "Cancelled" | "Pending" | "Refunded" | null
  >(null);

  //get logged in user orders
  const getAllOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/order/all-orders`
      );
      setOrders(data.orders);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //filter orders search
  const filteredOrders = useMemo(() => {
    const query = searchOrder.toLowerCase().trim();

    if (!query) return orders;

    return orders.filter((o) => {
      return (
        o.orderId?.toLowerCase().includes(query) ||
        o.paymentDetails?.some(
          (pd: PaymentDetail) =>
            pd.trxId?.toLowerCase().includes(query) ||
            pd.accNo?.toLowerCase().includes(query) ||
            pd.method?.toLowerCase().includes(query)
        )
      );
    });
  }, [orders, searchOrder]);

  const updateOrderStatus = async (
    status: "Accepted" | "Cancelled" | "Pending" | "Refunded"
  ) => {
    if (!selectedOrder) return;

    try {
      setActionLoading(true);
      setActionType(status);

      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/order/update-order-status/${selectedOrder._id}`,
        { status }
      );

      toast.success(`Order ${status}`);

      setOrders((prev) =>
        prev.map((o) => (o._id === selectedOrder._id ? { ...o, status } : o))
      );

      setSelectedOrder((prev: any) => ({ ...prev, status }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
      setActionType(null);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track all customer orders and transactions.
          </p>
        </div>

        {/* Search wrapper */}
        <div className="relative w-full max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            className="h-10 pl-9 bg-background"
            placeholder="Search Order ID, TrxID..."
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-md border bg-background shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Date Placed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Account No</TableHead>
              <TableHead>Trx ID</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center w-20">Action</TableHead>
            </TableRow>
          </TableHeader>
          
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Spinner /> Loading orders...
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-[300px] text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                       <Search className="h-8 w-8 text-muted-foreground/50" />
                       <h3 className="text-lg font-semibold text-foreground">No orders found</h3>
                       <p className="text-sm">Try adjusting your search criteria.</p>
                       <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setSearchOrder("")}
                       >
                         Clear Filters
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
                  <TableRow
                    key={order._id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-sm font-medium">
                        {order.orderId}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {dayjs(order.createdAt).format("DD MMM YYYY")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {dayjs(order.createdAt).format("hh:mm A")}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
             <Badge
                  variant="outline"
                  className={`px-2.5 py-0.5 text-xs font-semibold border ${
                    order?.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
                      : order?.status === "Accepted"
                      ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                      : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                  }`}
                >
                  {order?.status === "Pending" && (
                    <Clock size={12} className="mr-1.5" />
                  )}
                  {order?.status === "Accepted" && (
                    <CheckCircle size={12} className="mr-1.5" />
                  )}
                  {order?.status === "Cancelled" && (
                    <XCircle size={12} className="mr-1.5" />
                  )}
                  {order?.status === "Refunded" && (
                    <TicketX size={12} className="mr-1.5" />
                  )}
                  {order?.status}
                </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                         <CreditCard size={14} className="text-muted-foreground" />
                         {order.paymentDetails.length > 0 ? order.paymentDetails[0].method : "-"}
                      </div>
                    </TableCell>

                    <TableCell>
                         <span className="font-mono text-sm text-muted-foreground">
                            {order.paymentDetails.map((pd: PaymentDetail) => pd.accNo).join(", ")}
                         </span>
                    </TableCell>

                    <TableCell>
                         <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">
                            {order.paymentDetails.map((pd: PaymentDetail) => pd.trxId).join(", ")}
                         </span>
                    </TableCell>

                    <TableCell className="text-right">
                       <span className="font-mono font-bold text-sm">
                          ৳{order.finalPrice.toLocaleString()}
                       </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedOrder(order);
                          setOpen(true);
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Eye size={16} />
                        <span className="sr-only">View Order</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>
      </div>
      
      {/* Dialog */}
      <OrderDetailsDialog 
        open={open}
        setOpen={setOpen}
        selectedOrder={selectedOrder}
        updateOrderStatus={updateOrderStatus}
        actionLoading={actionLoading}
        actionType={actionType}
      />
    </div>
  );
}