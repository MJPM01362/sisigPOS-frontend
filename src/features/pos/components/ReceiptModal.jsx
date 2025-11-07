import ReceiptPreview from "./ReceiptPreview";

const ReceiptModal = ({ receiptData, paymentMethod, gcashCode, tip, cashPaid, onClose, receiptRef }) => {
  if (!receiptData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
        <div id="printable-receipt">
          <ReceiptPreview
            cart={receiptData.items}
            subtotal={receiptData.subtotal}
            vat={receiptData.vat}
            totalAmount={receiptData.total}
            paymentMethod={paymentMethod}
            gcashCode={gcashCode}
            tip={Number(tip || 0)}
            cashPaid={Number(cashPaid || 0)}
            ref={receiptRef}
          />
        </div>
        <button
          onClick={() => window.print()}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Print Receipt
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ReceiptModal;