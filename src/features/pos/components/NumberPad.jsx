const NumberPad = ({ value, onChange, currentTarget, setCurrentTarget }) => {
  const handleClick = (num) => {
    if (!currentTarget) return;
    onChange({ ...value, [currentTarget]: (value[currentTarget] || "") + num.toString() });
  };

  const handleClear = () => {
    if (!currentTarget) return;
    onChange({ ...value, [currentTarget]: "" });
  };

  const handleBackspace = () => {
    if (!currentTarget) return;
    onChange({ ...value, [currentTarget]: value[currentTarget]?.slice(0, -1) || "" });
  };

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    if (currentTarget) onChange({ ...value, [currentTarget]: val });
  };

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="flex flex-col gap-2 mt-2">
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={value.tip || ""}
          onChange={handleInputChange}
          onFocus={() => setCurrentTarget("tip")}
          className={`p-2 border border-[#262d34] rounded-lg text-center ${
            currentTarget === "tip" ? "bg-gray-200 text-[#262d34] font-bold" : "bg-white text-black"
          }`}
          placeholder="Tip"
        />
        <input
          type="text"
          value={value.cashPaid || ""}
          onChange={handleInputChange}
          onFocus={() => setCurrentTarget("cashPaid")}
          className={`p-2 border border-[#262d34] rounded-lg text-center ${
            currentTarget === "cashPaid" ? "bg-gray-200 text-[#262d34] font-bold" : "bg-white text-black"
          }`}
          placeholder="Cash"
        />
      </div>

      {/* Number Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => handleClick(num)}
            className="bg-gray-100 border border-gray-200 hover:border-none font-bold rounded-xl py-2 text-lg hover:bg-[#ffbf8a] hover:text-gray-800 transition"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleBackspace}
          className="bg-white border-2 border-[#262d34] text-[#262d34] font-bold hover:text-white hover:font-bold rounded-xl py-2 text-lg hover:bg-gray-800 transition"
        >
          ⌫
        </button>
        <button
          onClick={handleClear}
          className="bg-white border-2 border-[#fe7400] font-bold text-[#fe7400] hover:text-white rounded-xl py-2 text-lg hover:bg-[#fe7400] transition"
        >
          C
        </button>
      </div>
    </div>
  );
};

export default NumberPad;