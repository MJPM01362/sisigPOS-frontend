import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import api from "../../../services/api";

const CashierSalesReport = () => {
  const [cashiers, setCashiers] = useState([]);

  useEffect(() => {
    const fetchCashierSales = async () => {
      try {
        const res = await api.get("/reports/cashier-sales");
        setCashiers(res.data);
      } catch (err) {
        console.error("Error fetching cashier sales:", err);
      }
    };
    fetchCashierSales();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow h-full w-full flex flex-col overflow-hidden">
      {/* Header */}
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <ClipboardList size={18} /> Cashier Sales
      </h3>

      {/* Scrollable area constrained to parent height */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {cashiers.length === 0 ? (
          <p className="text-gray-500 text-sm">No cashier data available.</p>
        ) : (
          cashiers.map((cashier) => (
            <div
              key={cashier.cashierId}
              className="border rounded-lg p-3 shadow-sm hover:shadow transition text-sm flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {cashier.name || "Unnamed Cashier"}
                </p>
                <p className="text-gray-500 text-xs">
                  {cashier.email || "No email"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-800 font-semibold">
                  ₱{cashier.totalSales?.toFixed(2) || "0.00"}
                </p>
                <p className="text-xs text-gray-400">
                  {cashier.totalOrders} orders
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CashierSalesReport;