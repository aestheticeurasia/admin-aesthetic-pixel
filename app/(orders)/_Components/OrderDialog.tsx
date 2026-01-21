import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import {
  CheckCircle,
  Clock,
  ClockFading,
  CreditCard,
  RefreshCcw,
  TicketX,
  User,
  XCircle,
} from "lucide-react";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface OrderDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedOrder: any;
  updateOrderStatus: (
    status: "Accepted" | "Cancelled" | "Pending" | "Refunded",
  ) => void;
  actionLoading: boolean;
  actionType: "Accepted" | "Cancelled" | "Pending" | "Refunded" | null;
}

export function OrderDetailsDialog({
  open,
  setOpen,
  selectedOrder,
  updateOrderStatus,
  actionLoading,
  actionType,
}: OrderDetailsDialogProps) {
  if (!selectedOrder) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden gap-0 bg-background flex flex-col max-h-[95vh] lg:max-h-[95vh] [&>button]:z-50">
        <DialogHeader className="p-6 border-b bg-background z-10 shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <span>Order</span>
                  <span className="font-mono text-muted-foreground">
                    #{selectedOrder?.orderId}
                  </span>
                </DialogTitle>
                <DialogClose />
                <Badge
                  variant="outline"
                  className={`px-2.5 py-0.5 text-xs font-semibold border ${
                    selectedOrder?.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
                      : selectedOrder?.status === "Accepted"
                        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                        : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                  }`}
                >
                  {selectedOrder?.status === "Pending" && (
                    <Clock size={12} className="mr-1.5" />
                  )}

                  {selectedOrder?.status === "Accepted" && (
                    <CheckCircle size={12} className="mr-1.5" />
                  )}

                  {selectedOrder?.status === "Cancelled" && (
                    <XCircle size={12} className="mr-1.5" />
                  )}

                  {selectedOrder?.status === "Refunded" && (
                    <TicketX size={12} className="mr-1.5" />
                  )}

                  {selectedOrder?.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                Placed on {dayjs(selectedOrder?.createdAt).format("MMM D, YYYY")} at{" "}
                {dayjs(selectedOrder?.createdAt).format("h:mm A")}
              </p>
            </div>

            <button
              onClick={() => updateOrderStatus("Pending")}
              disabled={actionLoading || selectedOrder?.status === "Pending"}
              className="text-xs font-medium text-primary/80 hover:text-primary hover:bg-primary/5 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {actionLoading && actionType === "Pending" ? (
                <Spinner />
              ) : (
                <ClockFading size={14} />
              )}
              Set as Pending
            </button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 h-full min-h-0">
            <div className="md:col-span-8 p-6 bg-background space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  Order Items
                </h3>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                  {selectedOrder?.orderItems.length} items
                </span>
              </div>

              <div className="border rounded-lg max-h-100 overflow-y-auto">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent border-b-0">
                      <TableHead className="h-10 text-xs font-semibold w-[50px]">
                        #
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold">
                        Product
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-right">
                        Price
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-right">
                        Qty
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-right">
                        Photos
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold text-right">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder?.orderItems.map(
                      (item: any, index: number) => (
                        <TableRow
                          key={item._id}
                          className="hover:bg-muted/5 border-b last:border-0"
                        >
                          <TableCell className="py-3 text-xs text-muted-foreground w-[50px]">
                            {index + 1}
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="space-y-1">
                              <span className="font-medium text-sm block">
                                {item.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-3 font-mono text-sm">
                            ৳{item.unitPrice}
                          </TableCell>
                          <TableCell className="text-right py-3 font-mono text-sm">
                            x{item.quantity}
                          </TableCell>
                          <TableCell className="text-right py-3 font-mono text-sm">
                            {item.photos}
                          </TableCell>
                          <TableCell className="text-right py-3 font-medium font-mono text-sm">
                            ৳{item.totalProductPrice}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-dashed">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Updated by{" "}
                <span className="font-medium text-foreground">
                  {selectedOrder?.updatedBy?.name}
                </span>
                • {dayjs(selectedOrder?.updatedAt).format("MMM D, YYYY")} at{" "}
                {dayjs(selectedOrder?.updatedAt).format("h:mm A")}
              </div>
            </div>

            <div className="md:col-span-4 p-6 bg-muted/15 border-t md:border-t-0 md:border-l border-border flex flex-col gap-6">
              {/* Client Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <User size={12} /> Client Details
                </h3>
                <div className="bg-background rounded-lg border p-4 shadow-sm space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-0.5">
                      Name
                    </span>
                    <span className="font-medium text-sm">
                      {selectedOrder?.createdBy?.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-0.5">
                        Phone
                      </span>
                      <span className="font-mono text-xs">
                        {selectedOrder?.createdBy?.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-0.5">
                        Email
                      </span>
                      <span className="text-xs break-all">
                        {selectedOrder?.createdBy?.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={12} /> Payment
                </h3>
                {selectedOrder?.paymentDetails.map((pd: any) => (
                  <div
                    key={pd._id}
                    className="bg-background rounded-lg border p-3 shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                    <div className="font-medium text-sm mb-2">{pd.method}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block scale-90 origin-left">
                          Account
                        </span>
                        <span className="font-mono">{pd.accNo}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block scale-90 origin-left">
                          Trx ID
                        </span>
                        <span className="font-mono truncate" title={pd.trxId}>
                          {pd.trxId}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Summary */}
              <div className="bg-background rounded-lg border p-4 space-y-3 shadow-sm mt-auto">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono">
                      ৳{selectedOrder?.subTotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-mono text-xs bg-emerald-100 dark:bg-emerald-900/30 px-1.5 rounded">
                      -৳{selectedOrder?.discountedAmount}
                    </span>
                  </div>
                </div>
                <div className="border-t border-dashed my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Total Paid</span>
                  <span className="font-bold text-xl font-mono text-primary">
                    ৳{selectedOrder?.finalPrice}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="space-y-3 pt-2">
                <button
                  disabled={
                    actionLoading || selectedOrder?.status !== "Pending"
                  }
                  onClick={() => updateOrderStatus("Accepted")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
                >
                  {actionLoading && actionType === "Accepted" ? (
                    <Spinner className="text-white" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  Accept Order
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={
                      actionLoading || selectedOrder?.status !== "Pending"
                    }
                    onClick={() => updateOrderStatus("Refunded")}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border bg-background hover:bg-muted hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading && actionType === "Refunded" ? (
                      <Spinner />
                    ) : (
                      <RefreshCcw size={14} />
                    )}
                    Refund
                  </button>
                  <button
                    disabled={
                      actionLoading || selectedOrder?.status !== "Pending"
                    }
                    onClick={() => updateOrderStatus("Cancelled")}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border bg-background hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading && actionType === "Cancelled" ? (
                      <Spinner />
                    ) : (
                      <XCircle size={14} />
                    )}
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
