import {
  AlertTriangle,
  BarChart,
  LineChart,
  ListOrdered,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../../components/common/Spinner";
import api from "../../../services/api";
import authService from "../../../services/authService";
import SalesTrendChart from "../components/SalesTrendChart";
import SummaryCard from "../components/SummaryCard";
import HeroSection from "../components/HeroSection";
import EarningsChart from "../components/EarningsChart";
import CashierSalesReport from "../components/CashierSalesReport";
import OrderHistory from "../components/OrderHistory";
import AdminHeader from "../components/AdminHeader";

const AdminDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState({ products: [], rawMaterials: [] });
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [range, setRange] = useState("monthly");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [salesTrend, setSalesTrend] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [earningsData, setEarningsData] = useState([]);

  // Check admin access
  useEffect(() => {
    const user = authService.getUser();
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admins only.");
      window.location.href = "/";
    } else {
      setCheckingAccess(false);
    }
  }, []);

  // Fetch dashboard data
useEffect(() => {
  if (!checkingAccess) {
    const fetchDashboard = async () => {
      try {
        setLoadingSummary(true);
        const [summaryRes, topRes, lowStockRes, trendRes, earningsRes] = await Promise.all([
          api.get(`/reports/sales-summary?range=${range}`),
          api.get("/reports/top-products"),
          api.get("/reports/low-stock"),
          api.get(`/reports/sales-trend?range=${range}`),
          api.get(`/reports/earnings?range=${range}`)
        ]);

        // ✅ Fetch each top product’s image
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

        setSummary(summaryRes.data);
        setTopProducts(topProductsWithImages);
        setLowStock(lowStockRes.data);
        console.log(trendRes.data)
        setSalesTrend(trendRes.data);
        setEarningsData(earningsRes.data);
      } catch (err) {
        toast.error("Failed to load dashboard data.");
        console.error("❌ Dashboard fetch error:", err);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchDashboard();
  }
}, [checkingAccess, range]);

  useEffect(() => {
    if (topProducts.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % topProducts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [topProducts]);

  if (checkingAccess || !summary) {
    return <Spinner label="Loading admin dashboard..." />;
  }

  return (
    <div className="grid grid-cols-4 gap-4 grid-rows-[auto_2fr_5fr_5fr] h-screen">
      <div className="col-span-4">
        <AdminHeader />
      </div>

      <div className="px-4 pb-4 bg-transparent rounded-lg px-4 items-end flex justify-between">
        <div>
          <h2 className="text-4xl font-semibold text-gray-900">Your Sales Summary</h2>
        </div>
        <div>
          <select
          className="border rounded px-3 py-1 text-sm text-black"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="daily">Today</option>
          <option value="weekly">Last 7 Days</option>
          <option value="monthly">Last 30 Days</option>
        </select>
        </div> 
      </div>

      <div className="bg-violet-500 rounded-3xl shadow">
              <SummaryCard
              icon={<TrendingUp size={50} className="text-[#FA6501]" />}
              label="Total Revenue"
              value={`₱${summary.totalSales?.toFixed(2) || 0}`}
              previousValue={`₱${summary.previousSales?.toFixed(2) || 0}`}
              change={summary.salesChange}
            />
      </div>

      <div className="bg-violet-500 rounded-3xl shadow">
              <SummaryCard
              icon={<ListOrdered size={50} className="text-[#456457]" />}
              label="Total Orders"
              value={summary.totalOrders || 0}
              previousValue={summary.previousOrders || 0}
              change={summary.ordersChange}
            />
      </div>

      <div className="bg-pink-500 rounded-3xl shadow">
            <SummaryCard
              icon={<ShoppingCart size={50} className="text-[#B76FBA]" />}
              label="Items Sold"
              value={summary.totalItems || 0}
              previousValue={summary.previousItems || 0}
              change={summary.itemsChange}
            />
      </div>

      <div className="col-span-2 rounded-lg h-full overflow-hidden">
        <HeroSection topProducts={topProducts} currentIndex={currentIndex} />
        </div>

      <div className="rounded-lg bg-transparent">
        <EarningsChart data={earningsData} />
        </div>

      <div className="rounded-lg row-span-2 bg-white shadow overflow-hidden">
        <OrderHistory />
      </div>

      <div className="col-span-2 rounded-lg h-full overflow-hidden">
        <SalesTrendChart data={salesTrend} />
        </div>

      <div className="rounded-lg col-span-1 bg-transparent">
        <CashierSalesReport />
        </div>
    </div>
  );
};

export default AdminDashboardPage;