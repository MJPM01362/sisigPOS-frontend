import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../services/api";

const VerifyAdminModal = ({ isOpen, onClose, onVerified }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      await api.post("/auth/verify-admin", { email, password });
      toast.success("Admin verified");
      onVerified();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="bg-black/30 fixed inset-0" />
      <div className="bg-white rounded p-6 z-50 shadow-lg w-full max-w-md">
        <Dialog.Title className="text-lg font-bold mb-4">Admin Verification</Dialog.Title>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default VerifyAdminModal;