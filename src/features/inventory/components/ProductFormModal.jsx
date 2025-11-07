// src/components/modals/ProductFormModal.jsx
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import api from "../../../services/api";

const categories = ["Sisig", "Sizzling", "Silog", "Extras", "Drinks"];

const ProductFormModal = ({ isOpen, onClose, initialData = null, onSuccess }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchMaterials();
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setPrice(initialData.price);
      setQuantity(initialData.quantity);
      setIngredients(
        initialData.ingredients.map((ing) => ({
          materialId: typeof ing.material === "object" ? ing.material._id : ing.material,
          quantity: ing.quantity,
        }))
      );
      setOptions(initialData.options || []);
      setPreview(initialData.image || null);
    } else {
      setOptions([]);
    }
  }, [initialData]);

  const fetchMaterials = async () => {
    const res = await api.get("/raw-materials");
    setAllMaterials(res.data);
  };

  const handleAddIngredient = () => {
    const available = allMaterials.find(
      (mat) => !ingredients.some((ing) => ing.materialId === mat._id)
    );
    if (available) {
      setIngredients([...ingredients, { materialId: available._id, quantity: 1 }]);
    }
  };

  const handleIngredientChange = (idx, field, value) => {
    const updated = [...ingredients];
    updated[idx][field] = value;
    setIngredients(updated);
  };

  const handleRemoveIngredient = (idx) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleOptionChange = (idx, field, value) => {
    const updated = [...options];
    updated[idx][field] = field === "price" ? parseFloat(value) : value;
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, { label: "", price: 0 }]);
  const removeOption = (idx) => setOptions(options.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append(
      "ingredients",
      JSON.stringify(ingredients.map((i) => ({ material: i.materialId, quantity: i.quantity })))
    );

    if (["Sisig", "Sizzling"].includes(category)) {
      formData.append("options", JSON.stringify(options));
    }

    if (imageFile) formData.append("image", imageFile);

    try {
      if (initialData) await api.put(`/products/${initialData._id}`, formData);
      else await api.post("/products", formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("❌ Failed to save product", err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md max-h-[85vh] overflow-y-auto">
        <Dialog.Title className="text-base font-semibold mb-3">
          {initialData ? "Edit Product" : "Add Product"}
        </Dialog.Title>

        <div className="space-y-3 text-sm">
          {/* Name & Category */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input className="border rounded w-full p-1.5" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Category</label>
            <select className="border rounded w-full p-1.5" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Price & Quantity */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-medium mb-1">Price</label>
              <input type="number" className="border rounded w-full p-1.5" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Quantity</label>
              <input type="number" className="border rounded w-full p-1.5" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
          </div>

          {/* Options (for Sisig/Sizzling) */}
          {["Sisig", "Sizzling"].includes(category) && (
            <div>
              <label className="block font-medium mb-1">Options</label>
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-1.5">
                  <input
                    className="border rounded p-1 flex-1"
                    placeholder="Label (e.g. Solo)"
                    value={opt.label}
                    onChange={(e) => handleOptionChange(idx, "label", e.target.value)}
                  />
                  <input
                    className="border rounded p-1 w-20"
                    type="number"
                    placeholder="Price"
                    value={opt.price}
                    onChange={(e) => handleOptionChange(idx, "price", e.target.value)}
                  />
                  <button className="text-red-500 text-xs" onClick={() => removeOption(idx)}>
                    ✕
                  </button>
                </div>
              ))}
              <button className="text-blue-500 text-xs" onClick={addOption}>
                + Add Option
              </button>
            </div>
          )}

          {/* Ingredients */}
          <div>
            <label className="block font-medium mb-1">Ingredients</label>
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1.5">
                <select
                  value={ing.materialId}
                  onChange={(e) => handleIngredientChange(idx, "materialId", e.target.value)}
                  className="border rounded p-1 flex-1"
                >
                  {allMaterials.map((mat) => (
                    <option key={mat._id} value={mat._id}>
                      {mat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={ing.quantity}
                  onChange={(e) => handleIngredientChange(idx, "quantity", e.target.value)}
                  className="border rounded p-1 w-16"
                />
                <button className="text-red-500 text-xs" onClick={() => handleRemoveIngredient(idx)}>
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={handleAddIngredient}
              disabled={ingredients.length >= allMaterials.length}
              className="text-blue-500 text-xs disabled:text-gray-400"
            >
              + Add Ingredient
            </button>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1">Image</label>
            {preview && <img src={preview} alt="preview" className="w-24 h-24 object-cover mb-2 rounded" />}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600">
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductFormModal;