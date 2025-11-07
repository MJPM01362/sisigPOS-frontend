import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../services/api";
import authService from "../../../services/authService";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import VerifyAdminModal from "../components/VerifyAdminModal";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [verifyAction, setVerifyAction] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const requestAdminVerification = (action) => {
    setVerifyAction(() => action);
    setIsVerifyModalOpen(true);
  };

  const handleVerified = () => {
    if (verifyAction) verifyAction();
  };

  const checkAdmin = () => {
    const currentUser = authService.getUser();
    if (!currentUser || currentUser.role !== "admin") {
      toast.error("Access denied. Admins only.");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    checkAdmin();
    fetchUsers();
  }, []);

  const handleAddUser = async (userData) => {
    try {
      await api.post("/auth/register", userData);
      toast.success("User added");
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add user");
    }
  };

  const handleEditUser = async (userData) => {
    try {
      await api.put(`/users/${userData._id}`, {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
      toast.success("User updated");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleUpdatePassword = async (userId, newPassword) => {
    try {
      await api.put(`/auth/users/${userId}/password`, { newPassword });
      toast.success("Password updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      await api.delete(`/users/${userId}`);
      toast.success("User removed");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove user");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      <button
        onClick={() => requestAdminVerification(() => setIsAddModalOpen(true))}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Add New User
      </button>

      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2 capitalize">{user.role}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() =>
                    requestAdminVerification(() => setEditingUser(user))
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveUser(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddUser}
      />

      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleEditUser}
        onPasswordChange={handleUpdatePassword}
      />

      <VerifyAdminModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onVerified={handleVerified}
      />
    </div>
  );
};

export default UserManagementPage;