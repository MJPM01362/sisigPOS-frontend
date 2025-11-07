import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import AdvancedGradientModal from "./components/AdvancedGradientModal";
import ImageGalleryModal from "./components/ImageGalleryModal";
import LivePreviewModal from "./components/LivePreviewModal";


const presets = [
  {
    label: "Black to Gold (Gradient)",
    value: "bg-gradient-to-tr from-black via-red-600 to-yellow-300",
  },
  {
    label: "Sunset Image",
    value: 'url("https://images.unsplash.com/photo-1605470142405-4a21e4b6d3ce?auto=format&fit=crop&w=1400&q=80")',
  },
  {
    label: "Dark Minimal",
    value: "bg-gradient-to-br from-gray-900 to-gray-700",
  },
  {
    label: "Ocean Blue",
    value: "bg-gradient-to-tr from-blue-900 via-sky-700 to-cyan-300",
  },
];

const AdminBackgroundSettingsPage = () => {
  const [background, setBackground] = useState("");
  const [previewClass, setPreviewClass] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);


  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const res = await api.get("/admin/settings");
        const bg = res.data.loginPageBackground || "";
        setBackground(bg);
        setPreviewClass(bg);
      } catch (err) {
        toast.error("Failed to fetch background setting.");
      }
    };
    fetchBackground();
  }, []);

  const handleSave = async () => {
    try {
      console.log(background)
      await api.post("/admin/settings", { loginPageBackground: background });
      setPreviewClass(background);
      toast.success("Login page background updated!");
    } catch (err) {
      toast.error("Failed to save background.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Login Page Background Settings</h1>

      <label className="block mb-2 font-medium">Quick-select preset:</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => setBackground(preset.value)}
            className={`h-12 rounded text-xs font-medium text-white shadow-inner flex items-center justify-center hover:opacity-90 transition ${
              preset.value.includes("url(") ? "" : preset.value
            }`}
            style={
              preset.value.includes("url(")
                ? {
                    backgroundImage: preset.value,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowAdvancedModal(true)}
          className="px-4 py-2 text-sm bg-rose-600 text-white rounded hover:bg-rose-700"
        >
          Advanced Gradient
        </button>
        <button
          onClick={() => setShowGalleryModal(true)}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Select from Gallery
        </button>
      </div>


    <button
        onClick={() => setShowPreviewModal(true)}
        className="text-sm text-blue-600 underline mb-4"
        >
        Open Live Preview
    </button>

      <button
        onClick={handleSave}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-6"
      >
        Save Background
      </button>

    <LivePreviewModal
    isOpen={showPreviewModal}
    onClose={() => setShowPreviewModal(false)}
    previewClass={previewClass}
    />

    <ImageGalleryModal
      isOpen={showGalleryModal}
      onClose={() => setShowGalleryModal(false)}
      presets={presets}
      onSelect={(value) => {
        setBackground(value);
        setPreviewClass(value);
      }}
    />

    <AdvancedGradientModal
      isOpen={showAdvancedModal}
      onClose={() => setShowAdvancedModal(false)}
      initialGradient={background}
      onApply={async (value) => {
        try {
          setBackground(value);
          setPreviewClass(value);
          await api.post("/admin/settings", { loginPageBackground: value });
          toast.success("Login page background updated!");
        } catch (err) {
          toast.error("Failed to save background.");
        }
      }}
    />

    </div>
  );
};

export default AdminBackgroundSettingsPage;