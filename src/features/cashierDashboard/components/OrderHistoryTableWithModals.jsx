import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../services/api";
import ReceiptModal from "./ReceiptModal";
import RefundOrderModal from "./RefundOrderModal";
import VoidOrderModal from "./VoidOrderModal";
import { Eraser, FileX, RotateCcw, Search, Calendar } from "lucide-react";

const OrderHistoryTableWithModals = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchOrders = async (start, end) => {
    try {
      const res = await api.get("/orders", {
        params: start && end ? { start, end } : {},
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders.");
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders(startDate, endDate);
  }, [startDate, endDate]);

  const handleVoidOrder = async (orderId, adminCredentials) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await api.patch(`/orders/${orderId}/void`, adminCredentials);
      toast.success("Order voided successfully.");
      setShowVoidModal(false);
      fetchOrders(startDate, endDate);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to void order.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefundOrder = async (orderId, adminCredentials) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await api.patch(`/orders/${orderId}/refund`, adminCredentials);
      toast.success("Order refunded successfully.");
      setShowRefundModal(false);
      fetchOrders(startDate, endDate);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to refund order.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 px-2">
        <h2 className="text-lg font-bold text-gray-800">Order History</h2>
      </div>

      {/* Search Bar */}
      <div className="relative py-3">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fe7400] transition border border-gray-200"
        />
      </div>

      {/* Date Range Filters */}
      <div className="flex flex-wrap items-center justify-between rounded-lg px-4 mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="text-[#496157]" size={32} />
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm focus:outline-none text-[#496157] focus:scale-[1.05] transition"
            />
          </div>
        </div>

        <div className="h-9 w-px bg-gray-300"></div>

        <div className="flex items-center gap-2">
          <Calendar className="text-[#496157]" size={32} />
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm focus:outline-none text-[#496157] focus:scale-[1.05] transition"
            />
          </div>
        </div>

        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="flex items-center text-[#496157] p-3 px-2 rounded-lg text-sm transition hover:scale-[1.09] hover:text-[#fe7400]"
        >
          <Eraser size={22} />
        </button>
      </div>

      {/* Orders List (Horizontal Cards) */}
      <div className="flex-1 bg-transparent overflow-y-auto scrollbar-hide">
        <div className="max-h-[calc(70vh-55px)] overflow-y-auto scrollbar-hide">
          {filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500 py-4 italic">No orders found.</div>
        ) : (
          <div className="flex flex-col gap-1">
            {filteredOrders.map((order) => {
              const tenderedName = order.cashier?.name || "";
              const tenderedEmail = order.cashier?.email || "";

              const tenderedBy = tenderedName || tenderedEmail || "Unknown";

              const firstLetter = tenderedName
                ? tenderedName.trim().charAt(0).toUpperCase()
                : tenderedBy !== "Unknown"
                ? tenderedBy.trim().charAt(0).toUpperCase()
                : "?";
              const status = order.isVoided
                ? "Voided"
                : order.isRefunded
                ? "Refunded"
                : "Completed";

              const statusColor =
                status === "Voided"
                  ? "text-red-500 bg-red-50"
                  : status === "Refunded"
                  ? "text-yellow-500 bg-yellow-50"
                  : "text-gray-900 bg-white";

              return (
                <div
                  key={order._id}
                  onClick={() => {
                    if (!order.isVoided && !order.isRefunded) {
                      setSelectedOrder(order);
                      setShowReceiptModal(true);
                    }
                  }}
                  className={`flex items-center justify-between rounded-full px-4 py-3 hover:shadow-md hover:scale-[1.01] cursor-pointer transition ${status === "Voided"
                    ? "bg-red-50"
                    : status === "Refunded"
                    ? "bg-yellow-50"
                    : "bg-gray-100"
                    }`}
                >
                  {/* Left: Cashier + Info */}
                  <div className="flex items-center gap-5">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-white text-[#fe7400] flex items-center justify-center font-semibold text-base leading-none">
                    <span>{firstLetter}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 text-sm font-medium">{tenderedBy}</span>
                    <span className={`text-xs font-semibold rounded-full px-2 py-1 ${statusColor}`}>
                      {status}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-900 text-m font-semibold">
                    {order._id.slice(0, 10)}
                  </span>
                </div>

                  {/* Right: Actions */}
                  {!order.isVoided && !order.isRefunded && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                          setShowVoidModal(true);
                        }}
                        className="p-2 border rounded-full hover:bg-[#fe7400] hover:text-white hover:scale-[1.09] transition"
                        title="Void Order"
                      >
                        <FileX size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                          setShowRefundModal(true);
                        }}
                        className="p-2 border rounded-full hover:bg-[#fe7400] hover:text-white hover:scale-[1.09] transition"
                        title="Refund Order"
                      >
                        <RotateCcw size={18} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>

      {/* Modals */}
      {showVoidModal && selectedOrder && (
        <VoidOrderModal
          order={selectedOrder}
          onClose={() => setShowVoidModal(false)}
          onConfirm={handleVoidOrder}
          isProcessing={isProcessing}
        />
      )}
      {showRefundModal && selectedOrder && (
        <RefundOrderModal
          order={selectedOrder}
          onClose={() => setShowRefundModal(false)}
          onConfirm={handleRefundOrder}
          isProcessing={isProcessing}
        />
      )}
      {showReceiptModal && selectedOrder && (
        <ReceiptModal order={selectedOrder} onClose={() => setShowReceiptModal(false)} />
      )}
    </div>
  );
};

export default OrderHistoryTableWithModals;