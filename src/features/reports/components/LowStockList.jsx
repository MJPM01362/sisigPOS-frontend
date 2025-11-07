import { AlertTriangle } from "lucide-react";

const LowStockList = ({items }) => (
  <div>
    {items.length === 0 ? (
      <p className="text-gray-500 text-sm">All good!</p>
    ) : (
      <ul className="space-y-1 text-sm">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 text-red-600">
            {item.name} — {item.quantity} {item.unit || ""}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default LowStockList;