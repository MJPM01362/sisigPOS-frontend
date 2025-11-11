import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/common/Spinner";
import api from "../../../services/api";
import authService from "../../../services/authService";
import AlertModal from "../components/AlertModal";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backgroundClass, setBackgroundClass] = useState("");
  const navigate = useNavigate();
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      navigate(user.role === "admin" ? "/admin-dashboard" : "/pos", { replace: true });
    }
  }, []);

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const res = await api.get("/admin/settings");
        setBackgroundClass(res.data.loginPageBackground || "");
      } catch (err) {
        console.error("Failed to fetch login background", err);
        setBackgroundClass("");
      } finally {
        setIsBgLoaded(true);
      }
    };
    fetchBackground();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await authService.login(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.role === "admin" ? "/admin-dashboard" : "/pos", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setIsModalOpen(true);
    }
  };

  if (!isBgLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner />
      </div>
    );
  }

  const isCustomBackground =
  backgroundClass.includes("url(") || backgroundClass.includes("gradient(");

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-all duration-500 ${
        isCustomBackground
          ? ""
          : backgroundClass || "bg-gradient-to-br from-black via-red-600 to-yellow-300"
      }`}
      style={
        isCustomBackground
          ? {
              backgroundImage: backgroundClass,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      <form
        onSubmit={handleLogin}
        autoComplete="off"
        className="w-full max-w-sm bg-none p-8 justify-center items-center"
      >
        <div className="mb-4">
          <label className="block text-white/75 text-sm mb-1" htmlFor="email">
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            autoComplete="off"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-white p-2 border-b border-white/75 focus:outline-none bg-none"
          />
        </div>

        <div className="mb-6 relative items-center">
          <label className="block text-white/75 text-sm mb-1" htmlFor="password">
            PASSWORD
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-white p-2 border-b border-white/75 focus:outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2/3 -translate-y-1/2 text-white/50 hover:text-white hover:scale-[1.09]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex justify-center mt-6">
          <div className="relative inline-flex group">
            <div className="absolute -inset-px rounded-xl bg-white/10 backdrop-blur-md border border-white/30 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-white/50"></div>

            <button
              type="submit"
              className="relative inline-flex items-center justify-center px-8 py-2 font-semibold text-white/75 transition-all duration-300 rounded-xl z-10 group-hover:text-white group-hover:tracking-wider"
            >
              Login
            </button>
          </div>
        </div>
      </form>

      <AlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={error}
      />
    </div>
  );
};

export default LoginPage;
