const LivePreviewModal = ({ isOpen, onClose, previewClass }) => {
  if (!isOpen) return null;

  const isCustom =
    previewClass.includes("url(") || previewClass.includes("gradient(");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-2xl w-full">
        <h2 className="text-lg font-semibold mb-4">Background Preview</h2>
        <div
          className={`w-full h-64 rounded border transition-all duration-500 overflow-hidden ${
            isCustom ? "bg-cover bg-center" : previewClass
          }`}
          style={
            isCustom
              ? { backgroundImage: previewClass }
              : {}
          }
        />
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivePreviewModal;