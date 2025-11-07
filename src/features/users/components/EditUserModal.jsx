import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";

const EditUserModal = ({ isOpen, onClose, user, onSave, onPasswordChange }) => {
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, role: user.role, _id: user._id });
      setNewPassword("");
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    if (!newPassword) return alert("Please enter a new password.");
    await onPasswordChange(form._id, newPassword);
    setNewPassword("");
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="bg-black/30 fixed inset-0" />
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md z-50">
        <Dialog.Title className="text-lg font-bold mb-4">Edit User</Dialog.Title>

        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
        <select name="role" value={form.role} onChange={handleChange} className="border p-2 rounded mb-4 w-full">
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
        </select>

        {/* Change Password Section */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold mb-2 text-gray-700">Change Password</h3>
          <div className="flex space-x-2">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={handleChangePassword}
              className="bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600"
            >
              Change
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          <button onClick={() => onSave(form)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditUserModal;