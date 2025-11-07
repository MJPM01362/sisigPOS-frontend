import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import {
  LayoutDashboard,
  Package,
  Users,
  Image,
  LogOut,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";

const SidebarNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getUser();

  if (!user) return null;

  const isActive = (path) => location.pathname.startsWith(path);

  const navLinks =
    user.role === "admin"
      ? [
          { icon: <LayoutDashboard size={20} />, path: "/admin-dashboard" },
          { icon: <Package size={20} />, path: "/inventory" },
          { icon: <Users size={20} />, path: "/manage-users" },
        ]
      : [
          { icon: <LayoutDashboard size={20} />, path: "/cashier-dashboard" },
          { icon: <ShoppingCart size={20} />, path: "/pos" },
        ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-[#1B1B1D] text-white flex flex-col items-center py-6 space-y-6 transition-all duration-300 ease-in-out shadow-lg">
      <h2 className="text-xl font-bold mb-4 transition-all duration-300 ease-in-out hover:scale-110 hover:text-[#fe7400]">
        POS
      </h2>

      <nav className="flex flex-col items-center space-y-4 flex-1">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`p-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-110 ${
              isActive(link.path)
                ? "bg-[#fe7400] text-white shadow-md"
                : "text-[#fe7400] hover:text-white hover:bg-gray-700"
            }`}
          >
            {link.icon}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="p-3 rounded-lg text-[#fe7400] hover:text-[#fe7400] hover:bg-white transition-all duration-300 ease-in-out transform hover:scale-110"
      >
        <LogOut size={20} />
      </button>
    </aside>
  );
};

export default SidebarNavigation;