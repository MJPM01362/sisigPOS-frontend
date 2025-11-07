import { useState } from "react";

const RefundOrderModal = ({ order, onClose, onConfirm }) => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        await onConfirm(order._id, { adminEmail, adminPassword });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">Confirm Return</h2>

        <p className="mb-4">
          Enter admin credentials to return order {order._id}.
        </p>

        <input
          type="email"
          placeholder="Admin Email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          className="border p-2 mb-4 w-full"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Confirm Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundOrderModal;