import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { STATIC_BASE } from "../../../services/api";

const ProductCard = ({ product, cart, onAddToCart, onUpdateQuantity }) => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const isOutOfStock = product.quantity <= 0;

  // check if this product is already in the cart
  const cartItem = cart.find(
    (item) => item.product._id === product._id && !item.option
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleCardClick = () => {
    if (isOutOfStock) return;

    // If product has options, show them instead of adding directly
    if (product.options?.length > 0) {
      setShowOptions((prev) => !prev);
      return;
    }

    // Otherwise proceed as before
    if (quantity === 0) {
      onAddToCart(product);
    }
    setOverlayVisible(true);
  };

  const handleOptionSelect = (opt) => {
    onAddToCart({ ...product, selectedOption: opt });
    setShowOptions(false);
  };

  return (
    <div
      className={`relative bg-white shadow rounded-2xl flex flex-col transition overflow-hidden cursor-pointer
        ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
      `}
      onClick={handleCardClick}
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

      {/* Info section */}
      <div className="flex-1 flex flex-col justify-between p-3 text-center">
        <div>
          <div className="mb-6">
            <h3 className="font-semibold text-lg truncate">{product.name}</h3>
            <p className="text-xs text-gray-500">{product.category}</p>
          </div>

          <div className="flex justify-between items-center mt-2 px-2 sm:px-4">
            <p className="text-sm text-gray-500">
              {isOutOfStock ? "Out of Stock" : `Stock: ${product.quantity}`}
            </p>
            <p className="font-bold text-base text-[#fe7400]">
              ₱{product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Inline Option Buttons */}
      {showOptions && product.options?.length > 0 && (
        <div
          className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white p-4 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-base font-bold mb-3 text-center">
              Choose an option
            </h2>

            <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
              {product.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt)}
                  className="flex-shrink-0 bg-[#fe7400] text-white py-2 px-4 rounded-lg hover:bg-[#e66700] h-28 transition text-lg text-center min-w-[90px]"
                >
                  <span className="block font-medium">{opt.label}</span>
                  <span className="block text-xs">₱{opt.price.toFixed(2)}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowOptions(false)}
              className="mt-3 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Existing Quantity Overlay */}
      {overlayVisible && quantity > 0 && (
        <div
          className="absolute inset-0 bg-gray-600 flex flex-col items-center justify-between py-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mt-4 flex items-center gap-6 bg-white shadow-xl/30 rounded-full p-2">
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

            <span className="text-2xl font-bold text-[#fe7400]">{quantity}</span>

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
          </div>

          <div className="text-center text-white px-4">
            <h3 className="font-semibold text-lg truncate">{product.name}</h3>
            <p className="text-xs text-gray-300">{product.category}</p>

            <div className="flex justify-between gap-16 items-center mt-3 px-4">
              <p className="text-sm">
                {isOutOfStock ? "Out of Stock" : `Stock: ${product.quantity}`}
              </p>
              <p className="font-bold text-base text-white px-2 py-0.5">
                ₱{product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard; 