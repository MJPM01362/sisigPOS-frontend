import {
  Banknote,
  Beef,
  Circle,
  Coffee,
  EggFried,
  Flame,
  LayoutGrid,
  QrCode,
  Search,
  UtensilsCrossed,
  FileClock,
  ListChecks,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../../components/common/Spinner";
import authService from "../../../services/authService";
import CartItem from "../components/CartItem";
import NumberPad from "../components/NumberPad";
import ProductCard from "../components/ProductCard";
import QRCodeModal from "../components/QRCodeModal";
import ReceiptPreview from "../components/ReceiptPreview";
import { getAllProducts, placeOrder } from "../services/posApi";
import OrderHistoryTableWithModals from "../../cashierDashboard/components/OrderHistoryTableWithModals";
import ShiftClosingModal from "../../cashierDashboard/components/ShiftClosingModal";
import api from "../../../services/api";

const VAT_RATE = 0.12;

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [gcashCode, setGcashCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const receiptRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState("Dine-In");
  const [values, setValues] = useState({ tip: "", cashPaid: "" });
  const [currentTarget, setCurrentTarget] = useState("tip");
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeProductId, setActiveProductId] = useState(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [salesSummary, setSalesSummary] = useState(null);

  const CATEGORY_ICONS = {
    All: LayoutGrid,
    Drinks: Coffee,
    Extras: UtensilsCrossed,
    Sisig: Flame,
    Sizzling: Beef,
    Silog: EggFried,
  };

  const PAYMENT_ICONS = {
    Cash: Banknote,
    GCash: QrCode,
  };

  useEffect(() => {
    const checkCashier = () => {
      const user = authService.getUser();
      if (!user || user.role !== "cashier") {
        toast.error("Access denied. Cashiers only.");
        window.location.href = "/";
      } else {
        setCheckingAccess(false);
      }
    };
    checkCashier();
  }, []);

  useEffect(() => {
  if (!checkingAccess) {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const token = authService.getToken();
        const data = await getAllProducts(token);
        setProducts(data.filter((p) => p.isAvailable));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load products.");
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }
}, [checkingAccess]);

  const addToCart = (product, option = null) => {
  if (product.quantity <= 0) {
    toast.warning(`${product.name} is out of stock.`);
    return;
  }

  if (product.options && product.options.length > 0 && !option) {
    setOptionModalProduct(product);
    return;
  }

  addProductToCart(product, option);
};


  const addProductToCart = (product, option) => {
    const exists = cart.find(
      (item) =>
        item.product._id === product._id &&
        (item.option?.label || null) === (option?.label || null)
    );
    if (exists) {
      if (exists.quantity >= product.quantity) {
        toast.warning(`Only ${product.quantity} left in stock.`);
        return;
      }
      setCart(
        cart.map((item) =>
          item.product._id === product._id &&
          (item.option?.label || null) === (option?.label || null)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1, option }]);
    }
  };

  const removeFromCart = (productId, option) => {
    setCart(
      cart.filter(
        (item) =>
          !(
            item.product._id === productId &&
            (item.option?.label || null) === (option?.label || null)
          )
      )
    );
  };

  const updateQuantity = (productId, newQty, option = null) => {
    if (newQty <= 0) {
      setCart(
        cart.filter(
          (item) =>
            !(
              item.product._id === productId &&
              (item.option?.label || null) === (option?.label || null)
            )
        )
      );
    } else {
      // ✅ update normally
      setCart(
        cart.map((item) =>
          item.product._id === productId &&
          (item.option?.label || null) === (option?.label || null)
            ? { ...item, quantity: newQty }
            : item
        )
      );
    }
  };

  const calculateSubtotal = () =>
    cart.reduce(
      (sum, item) =>
        sum + (item.option?.price ?? item.product.price) * item.quantity,
      0
    );

  const calculateVAT = (subtotal) => subtotal - subtotal / (1 + VAT_RATE);
  const calculateTotal = (subtotal) => subtotal + Number(values.tip || 0);

  const getTotalDetails = () => {
    const subtotal = calculateSubtotal();
    const vat = calculateVAT(subtotal);
    const total = calculateTotal(subtotal);
    return { subtotal, vat, total };
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.warning("Cart is empty.");
      return;
    }
    if (paymentMethod === "Cash" && Number(values.cashPaid || 0) < getTotalDetails().total) {
      toast.warning("Insufficient cash received.");
      return;
    }
    if (paymentMethod === "GCash" && !gcashCode.trim()) {
      toast.warning("Please enter the GCash reference number.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          option: item.option ? item.option.label : null,
        })),
        paymentMethod,
        orderType,
        gcashCode: paymentMethod === "GCash" ? gcashCode.trim() : null,
        tip: Number(values.tip || 0),
        cashPaid: Number(values.cashPaid || 0),
      };
      const token = authService.getToken();
      await placeOrder(payload, token);

      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const orderedItem = cart.find((item) => item.product._id === product._id);
          if (!orderedItem) return product;
          return { ...product, quantity: product.quantity - orderedItem.quantity };
        })
      );

      toast.success("Order placed! Showing receipt preview...");
      const { subtotal, vat, total } = getTotalDetails();
      setReceiptData({ items: [...cart], subtotal, vat, total });
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const categoryCounts = products.reduce((acc, product) => {
  acc[product.category] = (acc[product.category] || 0) + 1;
  return acc;
}, {});

  if (checkingAccess) return <p className="p-6">Loading...</p>;

  const { subtotal, vat, total } = getTotalDetails();

if (checkingAccess) {
  return (
<div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-2xl shadow">
  <Spinner />
  <p className="mt-3 text-gray-600 font-medium">Loading products...</p>
</div>
  );
}

  return (
    <div className="flex flex-col gap-6 scrollbar-hide">
      {/*content uwu*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* left grid */}
        <div className="md:col-span-2 flex flex-col h-[calc(100vh-3rem)]">
          {/*search + categories*/}
          <div className="sticky top-0 z-30 bg-[#f3f3f3] pb-2">
            {/* Search Bar */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-full text-sm bg-gray-50 shadow-xs focus:ring"
              />
            </div>
          </div>

          {/* === CATEGORY BUTTONS === */}
          <div className="pt-3 pb-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-b2">
              {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category] || Circle;
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center justify-start gap-2 px-2 py-2 rounded-xl font-semibold w-full
                    ${isSelected ? "bg-[#fe7400] text-gray-900" : "bg-white text-gray-700"}
                    hover:scale-[1.05] active:scale-[0.98] transform transition-transform duration-200 ease-in-out hover:shadow-md`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg
                      ${isSelected ? "bg-white text-[#fe7400]" : "bg-gray-100 text-gray-600"}`}
                  >
                    <Icon size={28} />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span
                      className={`text-sm sm:text-base font-semibold ${
                        isSelected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {category}
                    </span>
                    <span
                      className={`text-xs ${isSelected ? "text-white" : "text-gray-500"}`}
                    >
                      {category === "All" ? products.length : categoryCounts[category] || 0} in Stock
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          </div>
          </div>
      
        {/* === PRODUCT GRID === */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {productsLoading ? (
            // 🔹 Localized Spinner (only inside product container)
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <Spinner />
              <p className="mt-3 text-gray-600 font-medium">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products
                .filter(
                  (p) =>
                    (selectedCategory === "All" || p.category === selectedCategory) &&
                    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.category.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    cart={cart}
                    onAddToCart={addToCart}
                    onUpdateQuantity={updateQuantity}
                    activeProductId={activeProductId}
                    setActiveProductId={setActiveProductId}
                  />
                ))}

              {/* 🔹 Show message if no products match search/filter */}
              {!productsLoading &&
                products.filter(
                  (p) =>
                    (selectedCategory === "All" || p.category === selectedCategory) &&
                    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.category.toLowerCase().includes(searchQuery.toLowerCase()))
                ).length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-10">
                    No products found.
                  </div>
                )}
            </div>
          )}
          </div>
        </div>

        {/* Right Grid */}
        <div className="flex flex-col h-[calc(100vh-3rem)]">
          {/* Profile Header with Actions */}
          <div className="flex items-center justify-between pb-4">
            {/* Left: Buttons */}
            <div className="flex gap-3">
            {/* Order History Button */}
            <button
              onClick={() => setShowOrderHistory(true)}
              className="flex items-center gap-2 bg-white hover:scale-[1.05] transform transition-transform duration-200 ease-in-out hover:shadow-xl text-white px-3 py-3 rounded-full transition-all duration-200 shadow-sm"
            >
              <FileClock size={24} color="#262D34"/>
            </button>

          <button
            onClick={async () => {
              try {
                const token = authService.getToken();
                const res = await api.get("/reports/sales-summary", {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setSalesSummary(res.data);
                setShowShiftModal(true);
              } catch (err) {
                toast.error("Failed to fetch shift summary.");
              }
            }}
            className="flex items-center gap-2 bg-white hover:scale-[1.05] transform transition-transform duration-200 ease-in-out hover:shadow-xl text-white px-3 py-3 rounded-full transition-all duration-200 shadow-sm "
          >
            <ListChecks size={24} color="#262D34"/>
          </button>

            </div>

            {/* Right: Profile */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#fe7400] text-white flex items-center justify-center font-bold text-lg">
                {authService.getUser()?.name?.charAt(0).toUpperCase() || "C"}
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-gray-800">
                  {authService.getUser()?.name || "Cashier"}
                </p>
                <p className="text-xs text-gray-500">{authService.getUser()?.email}</p>
              </div>
            </div>
          </div>

          {/* Cart Container */}
          <div className="bg-white rounded-2xl shadow flex flex-col flex-1 overflow-hidden relative">
            <h2 className="text-xl font-bold py-2 px-4">Order</h2>

            {/* Order Type Selector */}
            <div className="flex flex-wrap gap-2 px-4">
              {["Dine-In", "Delivery", "Takeout"].map((type) => {
                const isSelected = orderType === type;
                return (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 sm:flex-auto min-w-[80px] text-center px-2 py-2 rounded-full border font-bold transition
                    ${isSelected
                      ? "bg-[#1B1B1D] text-white"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

            {/* Scrollable Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
              {cart.length === 0 ? (
                <p className="text-gray-500">No items added yet.</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product._id}-${item.option?.label || "no-option"}`}
                    className="mb-3 last:mb-0 bg-white rounded-xl shadow-md p-3"
                  >
                    <CartItem
                      item={item}
                      onRemove={removeFromCart}
                      onUpdateQuantity={updateQuantity}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Sticky Bottom: Totals + Payment + NumberPad */}
            <div className="p-4 space-y-3"> {/* removed border-t */}
              {/* Total + Change Due on one line */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Total: ₱{total.toFixed(2)}</p>
                <p className="text-sm">
                  Change Due:{" "}
                  <span className="font-bold">
                    ₱{values.cashPaid && total ? Math.max(values.cashPaid - total, 0).toFixed(2) : "0.00"}
                  </span>
                </p>
              </div>

              {/* Payment Method */}
              <div className="flex gap-3 flex-wrap">
                {["Cash", "GCash"].map((method) => {
                  const isSelected = paymentMethod === method;
                  const Icon = PAYMENT_ICONS[method];
                  return (
                    <button
                      key={method}
                      onClick={() => {
                        setPaymentMethod(method);
                        if (method === "GCash") setShowQRModal(true);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border font-bold transition
                        ${isSelected
                          ? "bg-[#1B1B1D] text-white"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                        }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full
                        ${isSelected ? "bg-white text-gray-700" : "bg-gray-100 text-gray-700"}`}>
                        <Icon size={18} />
                      </div>
                      <span>{method}</span>
                    </button>
                  );
                })}
              </div>

              {/* GCash Reference */}
              {paymentMethod === "GCash" && (
                <div className="bg-gray-100 rounded p-3 flex flex-col gap-3">
                  <label className="block text-sm font-medium">GCash Reference Number</label>
                  <input
                    type="text"
                    value={gcashCode}
                    onChange={(e) => setGcashCode(e.target.value)}
                    placeholder="e.g. 123456789012"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
              )}

              {/* Number Pad */}
              <NumberPad
                value={values}
                onChange={setValues}
                currentTarget={currentTarget}
                setCurrentTarget={setCurrentTarget}
              />

              {/* Place Order */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full font-bold text-lg bg-[#fe7400] text-white py-2 px-4 rounded-full hover:bg-[#fe7400] transition flex items-center justify-center"
              >
                {loading ? <Spinner /> : "Place Order"}
              </button>

              {/* === FULLSCREEN LOADING SPINNER OVERLAY === */}
              {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
                    <Spinner />
                    <p className="mt-3 font-semibold text-gray-700">Processing Order...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === ORDER HISTORY MODAL === */}
      {showOrderHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white w-[90%] max-w-5xl rounded-xl shadow-xl p-6 relative">
                  <button
                  onClick={() => setShowOrderHistory(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                  >
                    ✕
                    </button>
                    <OrderHistoryTableWithModals />
                    </div>
                    </div>
                  )}
                  {showShiftModal && salesSummary && (
                    <ShiftClosingModal
                    onClose={() => setShowShiftModal(false)}
                    salesSummary={salesSummary}
                    />
                    )}

      {/* Receipt Modal */}
      {receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
            <div id="printable-receipt">
              <ReceiptPreview
                cart={receiptData.items}
                subtotal={receiptData.subtotal}
                vat={receiptData.vat}
                totalAmount={receiptData.total}
                paymentMethod={paymentMethod}
                gcashCode={gcashCode}
                tip={Number(values.tip || 0)}
                cashPaid={Number(values.cashPaid || 0)}
                ref={receiptRef}
              />
            </div>
            <button
              onClick={() => window.print()}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Print Receipt
            </button>
            <button
              onClick={() => {
                setReceiptData(null);
                setCart([]);
                setGcashCode("");
                setTip("");
                setCashPaid("");
              }}
              className="mt-2 w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && <QRCodeModal onClose={() => setShowQRModal(false)} />}
    </div>
  );
};

export default POSPage;