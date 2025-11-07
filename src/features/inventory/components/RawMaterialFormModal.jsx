import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import api from "../../../services/api";

const UNITS = [
  "kilograms", "grams", "pounds", "ounces",
  "liters", "milliliters",
  "pieces", "packs", "bags", "boxes", "cans",
];

const RawMaterialFormModal = ({ isOpen, onClose, initialData = null, onSuccess }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pieces");
  const [totalCost, setTotalCost] = useState("");
  const [costPerUnit, setCostPerUnit] = useState("");
  const [lastEdited, setLastEdited] = useState(null); // 'total' or 'unit'

  // ✅ Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setQuantity(initialData.quantity);
      setUnit(initialData.unit || "pieces");
      setTotalCost(initialData.totalCost || "");
      setCostPerUnit(initialData.costPerUnit || "");
    } else {
      setName("");
      setQuantity("");
      setUnit("pieces");
      setTotalCost("");
      setCostPerUnit("");
    }
  }, [initialData]);

  // 🔹 Update cost per unit when total cost changes
  useEffect(() => {
    if (lastEdited === "total" && quantity && totalCost) {
      const perUnit = parseFloat(totalCost) / parseFloat(quantity);
      if (!isNaN(perUnit)) setCostPerUnit(perUnit.toFixed(2));
    }
  }, [totalCost, quantity, lastEdited]);

  // 🔹 Update total cost when cost per unit changes
  useEffect(() => {
    if (lastEdited === "unit" && quantity && costPerUnit) {
      const total = parseFloat(costPerUnit) * parseFloat(quantity);
      if (!isNaN(total)) setTotalCost(total.toFixed(2));
    }
  }, [costPerUnit, quantity, lastEdited]);

  const handleSubmit = async () => {
    try {
      const payload = {
        name,
        quantity: Number(quantity),
        unit,
        totalCost: Number(totalCost),
        costPerUnit: Number(costPerUnit),
      };

      if (initialData) {
        await api.put(`/raw-materials/${initialData._id}`, payload);
      } else {
        await api.post("/raw-materials", payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save raw material", err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <Dialog.Title className="text-lg font-bold mb-4">
          {initialData ? "Edit Raw Material" : "Add Raw Material"}
        </Dialog.Title>

        <div className="space-y-3">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              className="border rounded w-full p-2"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium">Unit</label>
            <select
              className="border rounded w-full p-2"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Total Cost */}
          <div>
            <label className="block text-sm font-medium">Total Cost (₱)</label>
            <input
              type="number"
              className="border rounded w-full p-2"
              value={totalCost}
              onChange={(e) => {
                setTotalCost(e.target.value);
                setLastEdited("total");
              }}
            />
          </div>

          {/* Cost Per Unit */}
          <div>
            <label className="block text-sm font-medium">Cost per Unit (₱)</label>
            <input
              type="number"
              className="border rounded w-full p-2"
              value={costPerUnit}
              onChange={(e) => {
                setCostPerUnit(e.target.value);
                setLastEdited("unit");
              }}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default RawMaterialFormModal;