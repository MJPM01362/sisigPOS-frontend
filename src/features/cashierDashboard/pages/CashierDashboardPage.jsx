import {
  AlertTriangle,
  Printer,
  Star,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  CheckCheck,
  Timer,
  Pause,
  Play,
  Power,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../../components/common/Spinner";
import api, { STATIC_BASE } from "../../../services/api";
import authService from "../../../services/authService";
import OrderHistoryTableWithModals from "../components/OrderHistoryTableWithModals";
import ShiftClosingModal from "../components/ShiftClosingModal";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "../components/HeroSection";
import LowStockAlert from "../components/LowStockAlert";

const CashierDashboardPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState({ products: [], rawMaterials: [] });
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [salesSummary, setSalesSummary] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [todaySales, setTodaySales] = useState(null);
  const [loadingSales, setLoadingSales] = useState(true);
  const [salesComparison, setSalesComparison] = useState(null);
  const [activeShift, setActiveShift] = useState(null);
  const [shiftDuration, setShiftDuration] = useState({ hrs: "00", mins: "00", secs: "00" });
  const [loadingShift, setLoadingShift] = useState(true);

  // 🔐 Access check
  useEffect(() => {
    const user = authService.getUser();
    if (!user || user.role !== "cashier") {
      toast.error("Access denied. Cashiers only.");
      window.location.href = "/";
    } else {
      setCheckingAccess(false);
    }
  }, []);

  // 🔁 Hero section auto-slide
  useEffect(() => {
    if (topProducts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [topProducts]);

  // 📊 Fetch dashboard data
  useEffect(() => {
    if (!checkingAccess) {
      const fetchDashboard = async () => {
        try {
          const [featuredRes, topRes, lowStockRes, salesRes] = await Promise.all([
            api.get("/products/featured"),
            api.get("/reports/top-products"),
            api.get("/reports/low-stock"),
            api.get("/reports/sales-summary"),
          ]);

          const topProductsWithImages = await Promise.all(
            topRes.data.map(async (p) => {
              try {
                const productRes = await api.get(`/products/${p.productId}`);
                return {
                  ...p,
                  image: productRes.data.image,
                  category: productRes.data.category,
                };
              } catch {
                return { ...p, image: null, category: null };
              }
            })
          );

          const filteredTopProducts = topProductsWithImages.filter(
            (p) => p.category !== "Drinks" && p.category !== "Extras"
          );

          setFeaturedProducts(featuredRes.data);
          setTopProducts(filteredTopProducts);
          setLowStock(lowStockRes.data);
          setSalesSummary(salesRes.data);
          setSalesSummary(salesRes.data);
          setSalesComparison(salesRes.data);
        } catch (err) {
          toast.error("Failed to load dashboard data.");
          console.error("❌ Dashboard fetch error:", err);
        }
      };

      fetchDashboard();
    }
  }, [checkingAccess]);

    useEffect(() => {
    if (checkingAccess) return;

    const initShift = async () => {
      try {
        const user = authService.getUser();

        // Try to get the active shift
        let res = await api.get("/shifts/active");

        // If no active shift exists, start one
        if (!res.data?.shift) {
          res = await api.post("/shifts/start");
        }

        setActiveShift(res.data.shift);
        setLoadingShift(false);
      } catch (err) {
        if (err.response?.status === 404) {
          // no shift, create one
          try {
            const startRes = await api.post("/shifts/start");
            setActiveShift(startRes.data.shift);
          } catch (startErr) {
            toast.error("Failed to start shift");
          }
        } else {
          toast.error("Error initializing shift");
          console.error(err);
        }
      } finally {
        setLoadingShift(false);
      }
    };

    initShift();
  }, [checkingAccess]);

  useEffect(() => {
  const fetchUpdatedUser = async () => {
    const storedUser = authService.getUser();
    if (!storedUser) return;

    try {
      const res = await api.get(`/auth/users/${storedUser.id}`);
      if (res.data) {
        // ✅ Update localStorage so name is synced everywhere
        authService.setUser(res.data);
      }
    } catch (err) {
      console.error("❌ Failed to refresh user data:", err);
    }
  };

  fetchUpdatedUser();
}, []);


useEffect(() => {
  if (!activeShift?.startedAt || activeShift.status === "paused") return;

  const startTime = new Date(activeShift.startedAt);
  const updateTimer = () => {
    const now = new Date();
    const diff =
      Math.floor((now - startTime - (activeShift.totalPausedDuration || 0)) / 1000);
    const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
    const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const secs = String(diff % 60).padStart(2, "0");
    setShiftDuration({ hrs, mins, secs });
  };

  updateTimer();
  const interval = setInterval(updateTimer, 1000);
  return () => clearInterval(interval);
}, [activeShift]);

  useEffect(() => {
    const fetchTodaySales = async () => {
      try {
        const user = authService.getUser();
        setLoadingSales(true);
        const res = await api.get(`/reports/cashier-today-sales?cashierId=${user.id}`);
        setTodaySales(res.data);
      } catch (err) {
        toast.error("Failed to load today's sales");
        console.error("❌ Today sales fetch error:", err);
      } finally {
        setLoadingSales(false);
      }
    };

    if (!checkingAccess) fetchTodaySales();
  }, [checkingAccess]);

  if (checkingAccess) return <Spinner label="Loading cashier dashboard..." />;

  const user = authService.getUser();

const getSalesComparisonText = () => {
  if (!salesComparison) return null;
  const change = salesComparison.salesChange?.toFixed(1);
  const isUp = change >= 0;

  return (
    <div className="flex items-center text-sm mt-1">
      {isUp ? (
        <TrendingUp strokeLinecap="round" className="w-4 h-4 text-[#52685F] mr-1" />
      ) : (
        <TrendingDown strokeLinecap="round" className="w-4 h-4 text-[#FF6C02] mr-1" />
      )}
      <span className={isUp ? "text-[#52685F]" : "text-[#FF6C02]"}>
        {isUp ? "Increased by" : "Decreased by"} {Math.abs(change)}% vs yesterday
      </span>
    </div>
  );
};

const pauseShift = async () => {
  try {
    const res = await api.post("/shifts/pause");
    setActiveShift(res.data.shift);
    toast.info("Shift paused");
  } catch {
    toast.error("Failed to pause shift");
  }
};

const resumeShift = async () => {
  try {
    const res = await api.post("/shifts/resume");
    setActiveShift(res.data.shift);
    toast.success("Shift resumed");
  } catch {
    toast.error("Failed to resume shift");
  }
};

const endShift = async () => {
  try {
    await api.post("/shifts/end", { totalSales: 0, totalOrders: 0 });
    toast.success("Shift ended");
    authService.logout();
    window.location.href = "/";
  } catch {
    toast.error("Failed to end shift");
  }
};

  return (
    <div className="grid grid-cols-3 grid-rows-[1fr_4fr_2fr_2fr_2fr] gap-3 h-screen">
      {/* 👋 Welcome Section */}
      <div className="text-[#fe7400] rounded-lg col-span-2 px-4 flex flex-col justify-center">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.name}
        </h1>
        <p className="text-xs text-gray-900 opacity-90">
          Great to see you back! Let’s make today’s sales smooth and successful.
        </p>
      </div>

      {/* 👤 Profile */}
<div className="rounded-lg p-2 flex items-center justify-between"> 
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 rounded-full bg-[#fe7400] text-white flex items-center justify-center font-bold text-lg">
      {user?.name?.charAt(0).toUpperCase() || "C"}
      </div> 
      
      <div> 
        <p className="font-semibold text-gray-800">{user?.name}</p> 
        <p className="text-xs text-gray-500">{user?.email || "cashier@example.com"}</p> 
        </div>
        </div>
        
        <div className="justify-end">
          <button
            onClick={endShift}
            className="px-3 py-2 border border-red-600 text-red-600 text-base rounded-md hover:bg-red-600 hover:text-white transition"
          >
            End Shift
          </button>
        </div> 
      </div>

      {/* 🌟 Hero Section */}
      <div className="col-span-2">
        <HeroSection topProducts={topProducts} currentIndex={currentIndex} />
      </div>

      {/* 🧾 Order History */}
      <div className="bg-white shadow-md border-gray-400 rounded-lg p-2 row-span-4">
        <OrderHistoryTableWithModals />
      </div>

{/* 💰 Today’s Summary (2-Column Layout) */}
<div className="relative bg-white rounded-3xl shadow p-6 border border-gray-200 row-span-3 flex flex-col gap-9">
  {/* Header */}
  <div className="flex gap-4 items-center">
        <ShoppingCart
      size={22}
      strokeWidth={2}
      strokeLinecap="round"
      className="text-[#F96400]"
    />
    <h2 className="text-lg font-semibold text-gray-900">Today’s Summary</h2>
  </div>

  {/* Top Section: Sales + Transactions */}
  <div className="grid grid-cols-2 gap-6">
    {/* Sales Section */}
    <div>
      <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Today's Sale</p>
      {loadingSales ? (
        <Spinner small label="Loading sales..." />
      ) : todaySales ? (
        <>
          <p className="text-5xl font-semibold text-gray-900">
            <span className="text-lg align-top relative top-[-0.1em]">₱</span>
            {todaySales.totalSales?.toFixed(2) || 0}
          </p>
          {getSalesComparisonText()}
        </>
      ) : (
        <p className="text-gray-400 text-sm">No sales data yet today</p>
      )}
    </div>

    {/* Transactions Section */}
    <div>
      <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Transactions</p>
      {loadingSales ? (
        <Spinner small label="Loading transactions..." />
      ) : todaySales ? (
        <div>
          <motion.p
            key={todaySales.totalOrders}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-semibold text-gray-900"
          >
            {todaySales.totalOrders || 0} Orders
          </motion.p>

          <div className="flex items-center gap-6 mt-2 text-sm text-gray-700">
            <p className="text-[#7349A6]">{todaySales.totalItems || 0} Items Sold</p>
            <div className="w-px h-5 bg-gray-300" />
            <p className="text-[#7349A6]">
              ₱{todaySales.averageOrderValue?.toFixed(2) || 0} Avg / Order
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No transactions yet today</p>
      )}
    </div>
  </div>

  {/* Divider */}
  <div className="w-full h-px bg-gray-200" />

  {/* Bottom Section: Shift Timer */}
  <div>
    <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Shift Duration</p>
    {loadingShift ? (
      <Spinner small label="Loading shift..." />
    ) : activeShift ? (
      <div className="flex justify-between items-center">
<div className="flex items-end">
  <p className="text-7xl font-semibold text-gray-900 tracking-wide">
    {shiftDuration.hrs}:{shiftDuration.mins}
  </p>
  <span className="text-3xl text-gray-500 ml-1 mb-[0.35rem]">
    {shiftDuration.secs}
  </span>
</div>

        <div className="flex justify-end items-center w-1/3">
          {activeShift?.status === "active" ? (
            <button
              onClick={pauseShift}
              className="w-full flex justify-center items-center border-3 border-[#FC6200] text-[#FC6200] py-2 rounded-2xl hover:bg-yellow-50 transition"
              title="Pause Shift"
            >
              <Pause size={65} strokeWidth={0.9} />
            </button>
          ) : activeShift?.status === "paused" ? (
            <button
              onClick={resumeShift}
              className="w-full flex justify-center items-center border-3 border-[#4D7161] text-[#4D7161] py-2 rounded-2xl hover:bg-green-50 transition"
              title="Resume Shift"
            >
              <Play size={65} strokeWidth={0.9} />
            </button>
          ) : null}
        </div>
      </div>
    ) : (
      <p className="text-gray-400 text-sm">No active shift</p>
    )}
  </div>
</div>

      <div className="bg-[radial-gradient(circle_at_top_left,#4D7161_0%,#1B1B1D_80%)] rounded-xl row-span-3 border shadow border-gray-200">
        <LowStockAlert lowStock={lowStock} />
      </div>
    </div>
  );
};

export default CashierDashboardPage;