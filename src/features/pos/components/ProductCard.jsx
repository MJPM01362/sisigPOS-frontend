import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { STATIC_BASE } from "../../../services/api";
import { motion, AnimatePresence } from "framer-motion";

const ProductCard = ({
  product,
  cart,
  onAddToCart,
  onUpdateQuantity,
  activeProductId,
  setActiveProductId,
}) => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const isOutOfStock = product.quantity <= 0;

  const cartItem = cart.find(
    (item) => item.product._id === product._id && !item.option
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const showOptions = activeProductId === product._id;

  const handleCardClick = () => {
    if (isOutOfStock) return;

    if (product.options && product.options.length > 0) {
      setActiveProductId(showOptions ? null : product._id);
      return;
    }

    if (quantity === 0) {
      onAddToCart(product);
    }
    setOverlayVisible(true);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    onAddToCart(product, option);
    setActiveProductId(null);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
      className={`relative bg-white shadow rounded-2xl flex flex-col transition overflow-hidden cursor-pointer 
        ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:scale-[1.02]"}`}
      onClick={handleCardClick}
      style={{ transition: "all 0.25s ease-in-out" }}
    >
      {/* Image */}
      {product.image && (
        <div className="relative w-full h-32">
          <img
            src={`${STATIC_BASE}${product.image}`}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      {/* Info */}
 <div className="flex-1 flex flex-col justify-between p-3 text-left">
  <div className="items-center">
    <div className="flex items-start justify-between gap-2">
      {/* ✅ Product name and category (keeps alignment but allows wrapping) */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg break-words leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500">{product.category}</p>
      </div>

      {/* ✅ Price and stock info (unchanged alignment) */}
      <div className="text-right">
        <p className="font-bold text-3xl text-[#fe7400] leading-tight">
          ₱{product.price.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">
          {isOutOfStock ? "Out of Stock" : `Stock: ${product.quantity}`}
        </p>
      </div>
    </div>
  </div>
</div>

      {/* ✅ Options Overlay (Animated) */}
      <AnimatePresence>
        {showOptions && product.options?.length > 0 && (
          <motion.div
            key="options-overlay"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 bg-gray-600/70 flex items-center justify-center z-20"
            onClick={(e) => {
              e.stopPropagation();
              setActiveProductId(null);
            }}
          >
<motion.div
  className="rounded-lg max-w-md w-[90%] max-h-[90%] p-2"
  onClick={(e) => e.stopPropagation()}
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.1, duration: 0.25 }}
>
  <div className="flex flex-row gap-2">
    {product.options.map((option, index) => (
      <motion.button
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => {
          setActiveProductId(null);
          setSelectedOption(option);
          setTimeout(() => {
            onAddToCart(product, option);
            setSelectedOption(null);
          }, 150);
        }}
        className={`block items-center justify-center gap-2 w-full py-4 rounded-xl shadow transition-all duration-300
          ${
            selectedOption === option
              ? "bg-amber-500 text-white border-amber-500 scale-105"
              : "bg-white text-[#fe7400] border border-gray-300 hover:scale-[1.05]"
          }`}
      >
        <div>
        <span className="text-2xl font-semibold">
          {option.label}
        </span>
        </div>

<div >
        {option.price && (
          <span className="text-md text-gray-400">₱{option.price}</span>
        )}
</div>
      </motion.button>
    ))}
  </div>
</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Quantity Overlay (Animated) */}
      <AnimatePresence>
        {overlayVisible && quantity > 0 && (
          <motion.div
            key="quantity-overlay"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 bg-gray-600 flex flex-col items-center justify-between py-5"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="mt-2 flex items-center gap-6 bg-white rounded-full p-2"
            >
              <button
                onClick={() => {
                  if (quantity - 1 <= 0) {
                    setOverlayVisible(false);
                  }
                  onUpdateQuantity(product._id, Math.max(quantity - 1, 0));
                }}
                className="p-3 bg-white rounded-full text-[#fe7400] hover:bg-[#fe7400] hover:text-white transition"
              >
                <Minus size={28} />
              </button>

              <span className="text-2xl font-bold text-[#fe7400]">
                {quantity}
              </span>

              <button
                onClick={() => {
                  if (quantity < product.quantity) {
                    onUpdateQuantity(product._id, quantity + 1);
                  }
                }}
                className="p-3 bg-white rounded-full text-[#fe7400] hover:bg-[#fe7400] hover:text-white transition"
              >
                <Plus size={28} />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center text-white px-4"
            >
              <h3 className="font-semibold text-lg truncate">{product.name}</h3>
              <p className="text-xs text-gray-300">{product.category}</p>

              <div className="flex justify-between gap-16 items-center mt-3 px-4">
                <p className="text-sm">
                  {isOutOfStock
                    ? "Out of Stock"
                    : `Stock: ${product.quantity}`}
                </p>
                <p className="font-bold text-base text-white px-2 py-0.5">
                  ₱{product.price.toFixed(2)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;