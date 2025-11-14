import React from "react";
import { useNavigate } from "react-router-dom";

const UserInfoModal = ({ user, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !user) return null;

  // Full name from 'name' field, fallback to 'Administrator'
  const fullName = user.name || "Administrator";
  const displayEmail = user.email || "—";
  const displayRole = user.role || "Admin";

  // Avatar: pick first letter from name or email, fallback to "A"
  const avatarLetter =
    (user.name?.charAt(0)) ||
    (user.email?.charAt(0)) ||
    "A";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative flex flex-col items-center">
        {/* Avatar Circle */}
        <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-2xl mb-2">
          {avatarLetter.toUpperCase()}
        </div>

        {/* Name and Role */}
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800">{fullName}</h3>
          <p className="text-gray-500 capitalize">{displayRole}</p>
        </div>

        {/* Profile Details */}
        <div className="flex flex-col w-full border border-gray-200 rounded-lg">
          {[
            { label: "Name", value: fullName },
            { label: "Email", value: displayEmail },
            { label: "Role", value: displayRole },
          ].map((option) => (
            <div
              key={option.label}
              className="w-full text-left px-4 py-2 border-b border-gray-200 last:border-b-0"
            >
              <span className="font-bold">{option.label}:</span>{" "}
              <span className="text-gray-500">{option.value}</span>
            </div>
          ))}
        </div>

        {/* Manage Users Button (only for admins) */}
        {user.role === "admin" && (
          <button
            onClick={() => {
              navigate("/manage-users");
              onClose(); // close modal after navigation
            }}
            className="mt-4 w-full bg-[#fe7400] hover:bg-[#e86800] text-white font-medium px-4 py-2 rounded-lg transition-all"
          >
            Manage Users
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-400 hover:text-gray-600 transition-all duration-300 ease-in-out hover:scale-110 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default UserInfoModal;