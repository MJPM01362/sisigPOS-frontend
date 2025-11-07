const ImageGalleryModal = ({ isOpen, onClose, presets, onSelect }) => {
  if (!isOpen) return null;

  const imagePresets = presets.filter((preset) => preset.value.includes("url("));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-2xl w-full">
        <h2 className="text-lg font-semibold mb-4 text-center">Select Background Image</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {imagePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                onSelect(preset.value);
                onClose();
              }}
              className="h-28 rounded-lg overflow-hidden relative shadow hover:scale-105 transition-all duration-200"
              style={{
                backgroundImage: preset.value,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryModal;