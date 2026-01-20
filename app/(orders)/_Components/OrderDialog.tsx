import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
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
  RefreshCcw,
  TicketX,
  XCircle,
} from "lucide-react";

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
      <DialogContent className="sm:max-w-[900px] p-0  bg-white dark:bg-zinc-950">
        <DialogHeader className="p-6 border-b bg-zinc-50/50 dark:bg-zinc-900/50 sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Order #{selectedOrder?.orderId}
                </h2>
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
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                Placed on{" "}
                {dayjs(selectedOrder?.date).format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>

            <button
              onClick={() => updateOrderStatus("Pending")}
              disabled={actionLoading || selectedOrder?.status === "Pending"}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
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
        <div
          className="grid grid-cols-1 md:grid-cols-3 bg-zinc-50/30 dark:bg-zinc-900/10 
          max-h-[60vh]
           overflow-y-auto
  md:max-h-none 
  md:overflow-visible"
        >
          <div className="md:col-span-2 p-6 border-r space-y-6 bg-background">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                Order Items
                <span className="text-xs font-normal text-muted-foreground ml-auto">
                  {selectedOrder?.orderItems.length} items
                </span>
              </h3>
              <div className="border rounded-md max-h-100 overflow-y-auto">
                <Table>
                  <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-10 text-xs font-medium">
                        #
                      </TableHead>
                      <TableHead className="h-10 text-xs font-medium">
                        Product
                      </TableHead>
                      <TableHead className="h-10 text-xs font-medium text-right">
                        Price
                      </TableHead>
                      <TableHead className="h-10 text-xs font-medium text-right">
                        Qty
                      </TableHead>
                      <TableHead className="h-10 text-xs font-medium text-right">
                        Photos
                      </TableHead>
                      <TableHead className="h-10 text-xs font-medium text-right">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder?.orderItems.map(
                      (item: any, index: number) => (
                        <TableRow key={item._id} className="text-sm">
                          <TableCell className="py-3">{index + 1}</TableCell>
                          <TableCell className="py-3">
                            <div className="font-medium text-foreground">
                              {item.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-3 font-mono text-muted-foreground">
                            ৳{item.unitPrice}
                          </TableCell>
                          <TableCell className="text-right py-3 font-mono">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right py-3 font-mono">
                            {item.photos}
                          </TableCell>
                          <TableCell className="text-right py-3 font-medium font-mono">
                            ৳{item.totalProductPrice}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="pt-4 text-xs text-muted-foreground ">
              Last Updated by
              <span className="font-medium text-foreground">
                {" "}
                {selectedOrder?.createdBy?.name}
              </span>{" "}
              on{" "}
              {dayjs(selectedOrder?.updatedAt).format("DD MMM YYYY, hh:mm A")}
            </div>
          </div>

          <div className="md:col-span-1 p-6 space-y-8 bg-zinc-50/50 dark:bg-zinc-900/20">
            {/* Payment Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-foreground">
                Payment Details
              </h3>
              <div className="space-y-3">
                {selectedOrder?.paymentDetails.map((pd: any) => (
                  <div
                    key={pd._id}
                    className="bg-background border rounded-lg p-3 text-sm shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-foreground">
                        {pd.method}
                      </span>
                      <Badge
                        variant="secondary"
                        className="h-5 px-1.5 text-[10px] bg-green-100 text-green-700 hover:bg-green-100 border-transparent"
                      >
                        Paid
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>A/C:</span>{" "}
                        <span className="font-mono text-foreground">
                          {pd.accNo}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trx:</span>{" "}
                        <span className="font-mono text-foreground">
                          {pd.trxId}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Summary Section */}
            <div className="bg-background rounded-lg border p-4 space-y-3 shadow-sm">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono">৳{selectedOrder?.subTotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span className="font-mono text-red-500">
                    - ৳{selectedOrder?.discountedAmount}
                  </span>
                </div>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-bold text-sm">Total</span>
                <span className="font-bold text-lg font-mono">
                  ৳{selectedOrder?.finalPrice}
                </span>
              </div>
            </div>

            {/* ACTIONS SECTION */}
            <div className="space-y-3 pt-2">
              <button
                disabled={actionLoading || selectedOrder?.status !== "Pending"}
                onClick={() => updateOrderStatus("Accepted")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {actionLoading && actionType === "Accepted" ? (
                  <Spinner />
                ) : (
                  <CheckCircle size={16} />
                )}
                Accept Order
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={
                    actionLoading || selectedOrder?.status !== "Pending"
                  }
                  onClick={() => updateOrderStatus("Refunded")}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-zinc-200 bg-white hover:bg-zinc-50 hover:text-red-600 text-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
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
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-zinc-200 bg-white hover:bg-red-50 hover:text-red-600 text-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
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
      </DialogContent>
    </Dialog>
  );
}
