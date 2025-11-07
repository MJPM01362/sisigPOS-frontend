import { useState } from "react";
import { Filter, Utensils, Wheat } from "lucide-react";

const LowStockAlert = ({ lowStock }) => {
  const [filter, setFilter] = useState("All");

  const allLowStock = [
    ...lowStock.products.map((p) => ({ ...p, type: "Product" })),
    ...lowStock.rawMaterials.map((m) => ({ ...m, type: "Raw Material" })),
  ];

  const filteredItems =
    filter === "All"
      ? allLowStock
      : allLowStock.filter((item) => item.type === filter);

  const nextFilter = () => {
    if (filter === "All") return setFilter("Product");
    if (filter === "Product") return setFilter("Raw Material");
    return setFilter("All");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium text-white">Low Stock Items</h2>
        </div>
        <button
          onClick={nextFilter}
          className="flex items-center gap-1 text-xs text-white hover:text-[#fe7400] transition font-medium"
        >
          <Filter size={14} />
          {filter === "All"
            ? "All Items"
            : filter === "Product"
            ? "Products"
            : "Raw Materials"}
        </button>
      </div>

      {/* Scrollable Content */}
        <div className="flex-1 flex flex-col bg-transparent rounded-lg mx-4 mb-3">
        <div className="overflow-visible rounded-lg">
            <div className="max-h-[calc(50vh-55px)] overflow-y-auto scrollbar-hide py-2 space-y-2">
            {filteredItems.length === 0 ? (
              <p className="text-xs text-gray-400 px-3">
                No low stock {filter !== "All" ? filter.toLowerCase() + "s" : "items"} found.
              </p>
            ) : (
              filteredItems.map((item) => {
                const isOutOfStock = item.quantity <= 0;
                const isLowStock = item.quantity > 0 && item.quantity <= 5;
                const isProduct = item.type === "Product";

                const baseColor = isProduct
                  ? "bg-gray-500/5 hover:bg-[#fe7400]/5 hover:border-[#fe7400]"
                  : "bg-gray-500/5 hover:bg-[#019638]/5 hover:border-[#019638]";

                const Icon = isProduct ? Utensils : Wheat;

                // Dynamic quantity display
                const quantityText = isProduct
                  ? `${item.quantity} stock${item.quantity !== 1 ? "s" : ""} left`
                  : `${item.quantity} ${item.unit || ""} left`;

                return (
                  <div
                    key={item._id}
                    className={`grid grid-cols-3 grid-cols-[1fr_2.5fr_1.5fr] items-center rounded-lg transition ${baseColor}`}
                  >

                      <div
                        className={`h-full bg-white rounded-lg flex items-center justify-center ${
                          isProduct ? "bg-[#fe7400]/10" : "bg-green-100"
                        }`}
                      >
                        <Icon
                          size={22}
                          strokeWidth={1.5}
                          className={`${
                            isProduct ? "text-[#fe7400]" : "text-green-700"
                          }`}
                        />
                      </div>

                      <div className="flex items-center py-2 bg-white pl-3 h-full rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-md font-semibold text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {item.type}
                          {item.unit ? ` • ${item.unit}` : ""}
                        </span>
                      </div>
                    </div>

                      <div className="flex justify-end pr-3 bg-white items-center rounded-lg h-full">
                        <span
                        className={`text-xs font-semibold ${
                            isProduct
                            ? "text-[#fe7400]"
                            : "text-[#019638]"
                        }`}
                        >
                        {quantityText}
                        </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert;