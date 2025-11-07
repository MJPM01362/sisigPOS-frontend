import { Circle } from "lucide-react";

const CategorySelector = ({ categories, selectedCategory, onSelect, CATEGORY_ICONS }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category] || Circle;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`flex items-center justify-center w-12 h-12 rounded-full border transition
              ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            title={category}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
};

export default CategorySelector;