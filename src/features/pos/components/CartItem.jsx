import { Minus, Plus, X } from "lucide-react";

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const increment = () => {
    onUpdateQuantity(item.product._id, item.quantity + 1, item.option);
  };

  const decrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product._id, item.quantity - 1, item.option);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{item.product.name}</h4>

        {item.option ? (
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>Option: {item.option.label}</span>
            <span>• ₱{(item.option.price).toFixed(2)}</span>
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            ₱{item.product.price.toFixed(2)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={decrement}
          className="p-1 text-gray-500 border rounded-full hover:bg-gray-100"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={increment}
          className="p-1 text-gray-500 border rounded-full hover:bg-gray-100"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => onRemove(item.product._id, item.option)}
          className="text-red-500 hover:text-red-700"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;