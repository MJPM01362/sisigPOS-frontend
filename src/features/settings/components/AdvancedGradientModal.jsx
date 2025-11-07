import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";

// Updated gradient types with separate value and body
const GRADIENT_TYPES = [
  { label: "Linear 90° (Left to Right)", value: "linear-gradient", body: "90deg" },
  { label: "Linear 180° (Top to Bottom)", value: "linear-gradient", body: "180deg" },
  { label: "Linear 135° (Diagonal)", value: "linear-gradient", body: "135deg" },
  { label: "Linear 225° (Reverse Diagonal)", value: "linear-gradient", body: "225deg" },
  { label: "Linear 45° (Bottom-Left to Top-Right)", value: "linear-gradient", body: "45deg" },
  { label: "Radial Center", value: "radial-gradient", body: "circle at 50% 50%" },
  { label: "Radial Top-Left", value: "radial-gradient", body: "circle at 0% 0%" },
  { label: "Radial Top-Right", value: "radial-gradient", body: "circle at 100% 0%" },
  { label: "Radial Bottom-Left", value: "radial-gradient", body: "circle at 0% 100%" },
  { label: "Radial Bottom-Right", value: "radial-gradient", body: "circle at 100% 100%" },
];

const AdvancedGradientModal = ({ isOpen, onClose, onApply, initialGradient }) => {
  const [colors, setColors] = useState(["#000000", "#ffffff"]);
  const [gradientType, setGradientType] = useState(GRADIENT_TYPES[0]);
  const [activePickerIndex, setActivePickerIndex] = useState(null);

  useEffect(() => {
    if (!isOpen || !initialGradient || !initialGradient.includes("gradient")) return;

    const parsed = GRADIENT_TYPES.find(g =>
      initialGradient.startsWith(`${g.value}(${g.body}`)
    );

    const fallback = GRADIENT_TYPES[0];
    const selected = parsed || fallback;

    setGradientType(selected);

    const inside = initialGradient.slice(initialGradient.indexOf("(") + 1, -1);
    const parts = inside.split(",");
    const colorParts = parts.slice(1).map(s => s.trim());

    setColors(colorParts.length >= 2 ? colorParts : ["#000000", "#ffffff"]);
  }, [isOpen, initialGradient]);

  const updateColor = (index, color) => {
    const updated = [...colors];
    updated[index] = color.hex;
    setColors(updated);
  };

  const addColor = () => setColors([...colors, "#ffffff"]);

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
    if (activePickerIndex === index) setActivePickerIndex(null);
  };

  const generateGradient = (custom = gradientType) => {
    return `${custom.value}(${custom.body}, ${colors.join(", ")})`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div
        className="bg-white rounded-2xl p-6 shadow-2xl max-w-4xl w-full
                  max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold mb-6 text-center">
          Advanced Gradient Builder
        </h2>

        {/* Gradient Type Dropdown */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Gradient Type:</label>
          <select
            value={gradientType.label}
            onChange={(e) => {
              const selected = GRADIENT_TYPES.find(g => g.label === e.target.value);
              if (selected) setGradientType(selected);
            }}
          >
            {GRADIENT_TYPES.map((g) => (
              <option key={g.label} value={g.label}>{g.label}</option>
            ))}
          </select>
        </div>

        {/* Color Pickers */}
        <div className="flex flex-wrap gap-4 mb-6">
          {colors.map((color, index) => (
            <div key={index} className="relative flex flex-col items-center">
              <div
                onClick={() =>
                  setActivePickerIndex(activePickerIndex === index ? null : index)
                }
                className="w-10 h-10 rounded-full border-2 border-white shadow cursor-pointer"
                style={{ backgroundColor: color }}
              />
              {colors.length > 2 && (
                <button
                  onClick={() => removeColor(index)}
                  className="absolute top-[-6px] right-[-6px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                  title="Remove color stop"
                >
                  ×
                </button>
              )}
              {activePickerIndex === index && (
                <div className="absolute top-12 z-40">
                  <ChromePicker
                    color={color}
                    onChange={(c) => updateColor(index, c)}
                    disableAlpha
                  />
                </div>
              )}
            </div>
          ))}
          <button
            onClick={addColor}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xl font-bold"
          >
            +
          </button>
        </div>

        {/* Live Preview */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Live Preview:</label>
          <div
            className="w-full h-32 rounded-xl border border-gray-300 shadow-inner"
            style={{
              backgroundImage: generateGradient(),
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        {/* Try with other styles */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Try with other styles:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GRADIENT_TYPES.map((style) => (
              <button
                key={style.label}
                onClick={() => setGradientType(style)}
                className={`rounded-lg h-20 w-full text-xs font-medium relative overflow-hidden border-2 ${
                  gradientType.label === style.label ? "border-blue-500" : "border-transparent"
                }`}
                style={{
                  backgroundImage: generateGradient(style),
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white py-1 text-center">
                  {style.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const finalGradient = generateGradient();
              onApply(finalGradient);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Apply Gradient
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedGradientModal;