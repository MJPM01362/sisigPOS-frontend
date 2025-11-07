const QRCodeModal = ({ onClose, gcashCode, setGcashCode }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl relative flex flex-col gap-4">
        <h2 className="text-lg font-bold mb-2 text-center">Scan to Pay via GCash</h2>
        <img
          src="/src/assets/my-gcash-qr.png"
          alt="GCash QR"
          className="w-full rounded shadow"
        />
        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;