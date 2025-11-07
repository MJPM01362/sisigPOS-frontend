import { useEffect, useState } from "react";
import { DollarSign, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";

const CashierReportsPage = () => {
  const [cashiers, setCashiers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCashier, setSelectedCashier] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReport = async () => {
    try {
      setLoading(true);
      const query = [];
      if (dateRange.start && dateRange.end) {
        query.push(`startDate=${dateRange.start}`, `endDate=${dateRange.end}`);
      }
      const res = await api.get(
        `/reports/cashier-sales${query.length ? `?${query.join("&")}` : ""}`
      );
      setCashiers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch cashier sales:", err);
      toast.error("Failed to load cashier sales report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const fetchCashierOrders = async (cashierId) => {
    try {
      const res = await api.get(`/reports/cashier-orders/${cashierId}`);
      setOrders(res.data);
      setSelectedCashier(cashierId);
    } catch (err) {
      toast.error("Failed to load cashier orders.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md h-full w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
            <DollarSign size={22} /> Cashier Sales Report
          </h2>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          className="border rounded px-2 py-1 text-sm"
          value={dateRange.start}
          onChange={(e) =>
            setDateRange({ ...dateRange, start: e.target.value })
          }
        />
        <span>to</span>
        <input
          type="date"
          className="border rounded px-2 py-1 text-sm"
          value={dateRange.end}
          onChange={(e) =>
            setDateRange({ ...dateRange, end: e.target.value })
          }
        />
      </div>

      {/* Cashier Cards */}
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cashiers.map((c) => {
            const name = c.cashierName || c.cashierEmail || "Unknown";
            const initial = name.charAt(0).toUpperCase();
            return (
              <div
                key={c.cashierId}
                onClick={() => fetchCashierOrders(c.cashierId)}
                className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition ${
                  selectedCashier === c.cashierId ? "border-blue-500" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {initial}
                    </div>
                    <span className="font-medium text-gray-800">{name}</span>
                  </div>
                  <span className="text-green-600 font-semibold">
                    ₱{c.totalSales.toFixed(2)}
                  </span>
                </div>

                {/* Orders List */}
                {selectedCashier === c.cashierId && (
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    {orders.length === 0 ? (
                      <p>No orders found.</p>
                    ) : (
                      orders.map((o) => (
                        <div
                          key={o._id}
                          className="border rounded px-2 py-1 text-xs bg-gray-50"
                        >
                          <p>
                            <span className="font-semibold">
                              #{o._id.slice(-6).toUpperCase()}
                            </span>{" "}
                            ₱{o.total.toFixed(2)}
                          </p>
                          <p className="text-gray-500">
                            {new Date(o.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CashierReportsPage;