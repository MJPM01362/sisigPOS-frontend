import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import api from "../../../services/api";
import { toast } from "react-toastify";
import ReceiptModal from "../../cashierDashboard/components/ReceiptModal";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      // ✅ Show all orders, sorted by newest first
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
      toast.error("Failed to load order history.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col h-full overflow-hidden scrollbar-hide">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
          <ClipboardList size={20} /> Recent Orders
        </h3>
        <button
          onClick={fetchOrders}
          className="text-sm text-blue-600 hover:underline"
        >
          Refresh
        </button>
      </div>

      {/* Scrollable order list */}
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center text-sm flex-1 flex items-center justify-center scrollbar-hide">
          No recent orders.
        </p>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex justify-between items-center border rounded-lg px-3 py-2 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => {
                setSelectedOrder(order);
                setShowReceiptModal(true);
              }}
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600 text-sm">
                  ₱{order.total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  {order.cashier?.email || "Unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Receipt modal */}
      {showReceiptModal && selectedOrder && (
        <ReceiptModal
          order={selectedOrder}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};

export default OrderHistory;