import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../services/api";
import authService from "../../../services/authService";
import ProductCard from "../components/ProductCard";
import ProductFormModal from "../components/ProductFormModal";
import RawMaterialFormModal from "../components/RawMaterialFormModal";
import RawMaterialTable from "../components/RawMaterialTable";

const InventoryManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isMaterialModalOpen, setMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const checkAdmin = () => {
    const user = authService.getUser();
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admins only.");
      window.location.href = "/";
    } else {
      setCheckingAccess(false);
    }
  };

  const fetchData = async () => {
    try {
      const [productRes, materialRes] = await Promise.all([
        api.get("/products"),
        api.get("/raw-materials"),
      ]);

      setProducts(productRes.data);
      setRawMaterials(materialRes.data);
    } catch (err) {
      console.error("Failed to load inventory", err);
    }
  };

  const handleDeleteRawMaterial = async (materialId) => {
    if (confirm("Are you sure you want to delete this raw material?")) {
      try {
        await api.delete(`/raw-materials/${materialId}`);
        fetchData();
      } catch (err) {
        console.error("Failed to delete raw material", err);
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${productId}`);
        fetchData();
      } catch (err) {
        console.error("Failed to delete product", err);
      }
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (!checkingAccess) fetchData();
  }, [checkingAccess]);

  if (checkingAccess) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      {/* Products Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Products</h2>
          <button
            onClick={() => {
              setEditingProduct(null);
              setProductModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={() => {
                setEditingProduct(product);
                setProductModalOpen(true);
              }}
              onDelete={() => handleDeleteProduct(product._id)}
            />
          ))}
        </div>

        <ProductFormModal
          isOpen={isProductModalOpen}
          onClose={() => setProductModalOpen(false)}
          initialData={editingProduct}
          onSuccess={fetchData}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Raw Materials</h2>
          <button
            onClick={() => {
              setEditingMaterial(null);
              setMaterialModalOpen(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Add Raw Material
          </button>
        </div>

        <RawMaterialTable
          materials={rawMaterials}
          onEdit={(material) => {
            setEditingMaterial(material);
            setMaterialModalOpen(true);
          }}
          onDelete={handleDeleteRawMaterial}
        />

        <RawMaterialFormModal
          isOpen={isMaterialModalOpen}
          onClose={() => setMaterialModalOpen(false)}
          initialData={editingMaterial}
          onSuccess={fetchData}
        />
      </div>
    </div>
  );
};

export default InventoryManagementPage;