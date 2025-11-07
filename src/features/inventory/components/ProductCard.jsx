import { STATIC_BASE } from "../../../services/api";
import { Star } from "lucide-react";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { useState } from "react";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [isFeatured, setIsFeatured] = useState(product.isFeatured);

  const toggleFeatured = async () => {
    try {
      const updated = await api.put(`/products/${product._id}`, {
        isFeatured: !isFeatured,
      });
      setIsFeatured(updated.data.isFeatured);
      toast.success(
        `${product.name} ${
          updated.data.isFeatured ? "marked as featured" : "removed from featured"
        }`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update featured status");
    }
  };

  return (
    <div className="relative bg-white shadow rounded-lg overflow-hidden flex flex-col transition hover:shadow-md">
      {/* ⭐ Featured Toggle */}
      <button
        onClick={toggleFeatured}
        className={`absolute top-2 right-2 p-1.5 rounded-full transition ${
          isFeatured
            ? "bg-yellow-400 text-white hover:bg-yellow-500"
            : "bg-gray-200 text-gray-600 hover:bg-yellow-100"
        }`}
        title={isFeatured ? "Unfeature Product" : "Mark as Featured"}
      >
        <Star
          className="w-4 h-4"
          fill={isFeatured ? "white" : "none"}
        />
      </button>

      {/* Product Image */}
      {product.image ? (
        <img
          src={`${STATIC_BASE}${product.image}`}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-1">
            ₱{product.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Category: {product.category}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Stock: {product.quantity}
          </p>
          <p
            className={`text-sm font-semibold ${
              product.isAvailable ? "text-green-500" : "text-red-500"
            }`}
          >
            {product.isAvailable ? "Available" : "Not Available"}
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;