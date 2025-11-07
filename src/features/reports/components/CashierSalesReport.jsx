import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DollarSign, ArrowRightCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const CashierSalesReport = () => {
  const [cashiers, setCashiers] = useState([]);
  const [orderCounts, setOrderCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports/cashier-sales");
      setCashiers(res.data);

      // Fetch order counts for each cashier
      const counts = {};
      await Promise.all(
        res.data.map(async (c) => {
          try {
            const ordersRes = await api.get(`/reports/cashier-orders/${c.cashierId}`);
            counts[c.cashierId] = ordersRes.data.length || 0;
          } catch {
            counts[c.cashierId] = 0;
          }
        })
      );
      setOrderCounts(counts);
    } catch (err) {
      console.error("❌ Failed to fetch cashier sales:", err);
      toast.error("Failed to load cashier sales report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600">
        Loading cashier sales report...
      </div>
    );
  }

  return (
    <div className="p-4 bg-white space-y-4 rounded-lg shadow h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <DollarSign size={20} /> Cashier Sales Report
        </h3>
        <button
          onClick={() => navigate("/admin/cashier-reports")}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <ArrowRightCircle size={18} />
        </button>
      </div>

      {/* Cashier Cards */}
      {cashiers.length === 0 ? (
        <p className="text-gray-600 text-center">No cashier sales found.</p>
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto flex-1">
          {cashiers.map((c) => {
            const displayName =
              c.cashierName ||
              c.userName ||
              (c.cashierEmail
                ? c.cashierEmail.split("@")[0].replace(/\./g, " ")
                : "Unknown");

            const firstName = displayName.split(" ")[0];
            const initial = firstName.charAt(0).toUpperCase();

            const totalOrders = orderCounts[c.cashierId] ?? 0;

            return (
              <div
                key={c.cashierId}
                className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold">
                    {initial}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium capitalize">
                      {displayName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {c.cashierEmail || "No email available"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-green-600 font-semibold">
                    ₱{c.totalSales.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {totalOrders} order{totalOrders !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CashierSalesReport;