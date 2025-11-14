import { useEffect, useState } from "react";
import { Wheat, MoreVertical } from "lucide-react"; // <-- import vertical ellipsis
import api from "../../../services/api";
import authService from "../../../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserInfoModal from "../components/UserInfoModal"; // <-- import modal

const AdminHeader = () => {
  const [admin, setAdmin] = useState(null);
  const [date, setDate] = useState("");
  const [lowStock, setLowStock] = useState({ products: [], rawMaterials: [] });
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false); // <-- modal state
  const navigate = useNavigate();
  const [range, setRange] = useState("daily");

  useEffect(() => {
    const user = authService.getUser();
    setAdmin(user);

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-PH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setDate(formattedDate);

    const fetchLowStock = async () => {
      try {
        const res = await api.get("/reports/low-stock");
        setLowStock(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch low stock alerts:", err);
        toast.error("Failed to load low-stock data.");
      }
    };
    fetchLowStock();
  }, []);

  const totalLowStock =
    (lowStock.products?.length || 0) + (lowStock.rawMaterials?.length || 0);

  return (
    <div className="flex justify-between items-center h-full">
      {/* Greeting and Date */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          {admin ? `Welcome back, ${admin.name || "Admin"}!` : "Welcome, Admin!"}
        </h2>
        <p className="text-gray-500 text-sm">{date}</p>
      </div>

      {/* Low Stock + Profile */}
      <div className="flex items-center gap-6">
        {/* Wheat icon */}
        <div className="bg-white p-2 h-10 w-10 rounded-full flex items-center justify-center shadow">
          <button
            onClick={() => setShowLowStockModal(true)}
            className="relative text-amber-700 hover:text-amber-800 transition"
          >
            <Wheat size={26} strokeLinecap="round" color="gray" />
            {totalLowStock > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
                {totalLowStock}
              </span>
            )}
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center">
            {admin?.name
              ? admin.name.charAt(0).toUpperCase()
              : admin?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-800">
              {admin?.name || "Administrator"}
            </p>
            <p className="text-xs text-gray-500">
              {admin?.email || "admin@example.com"}
            </p>
          </div>

          {/* Vertical Ellipsis */}
          <button
            onClick={() => setShowUserModal(true)}
            className="ml-2 p-2 rounded-full hover:bg-gray-100 transition"
            title="View Profile"
          >
            <MoreVertical size={20} color="gray" />
          </button>
        </div>
      </div>

      {/* Low Stock Modal */}
      {showLowStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          {showLowStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Low Stock Items
            </h3>

            {totalLowStock === 0 ? (
              <p className="text-gray-500 text-center">
                All products and materials are well stocked.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {lowStock.products?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">
                      🛒 Products
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {lowStock.products.map((p) => (
                        <li
                          key={p._id}
                          className="border-b border-gray-100 pb-1 flex justify-between"
                        >
                          <span>{p.name}</span>
                          <span className="text-red-600 font-medium">
                            {p.quantity} {p.unit || ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lowStock.rawMaterials?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">
                      🌾 Raw Materials
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {lowStock.rawMaterials.map((r) => (
                        <li
                          key={r._id}
                          className="border-b border-gray-100 pb-1 flex justify-between"
                        >
                          <span>{r.name}</span>
                          <span className="text-red-600 font-medium">
                            {r.quantity} {r.unit || ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Manage Inventory Button */}
            {totalLowStock > 0 && (
              <div className="mt-5 flex justify-center">
                <button
                  onClick={() => {
                    setShowLowStockModal(false);
                    navigate("/inventory"); // ✅ redirect to inventory
                  }}
                  className="bg-[#fe7400] hover:bg-[#e86800] text-white px-4 py-2 rounded-lg font-medium transition-all"
                >
                  Manage Inventory
                </button>
              </div>
            )}

            <button
              onClick={() => setShowLowStockModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
        </div>
      )}

      {/* User Info Modal */}
      <UserInfoModal
        user={admin}
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
      />
    </div>
  );
};

export default AdminHeader;
