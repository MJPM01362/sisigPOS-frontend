import { Dialog } from "@headlessui/react";
import { useState } from "react";

const AddUserModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "cashier" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="bg-black/30 fixed inset-0" />
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md z-50">
        <Dialog.Title className="text-lg font-bold mb-4">Add New User</Dialog.Title>

        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} className="border p-2 rounded mb-2 w-full" />
        <select name="role" value={form.role} onChange={handleChange} className="border p-2 rounded mb-4 w-full">
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          <button onClick={() => onSave(form)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddUserModal;