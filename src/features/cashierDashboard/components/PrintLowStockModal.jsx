import { X } from "lucide-react";

const PrintLowStockModal = ({ products = [], rawMaterials = [], onClose }) => {
  const handlePrint = () => {
    const printContent = document.getElementById("print-content");
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Low Stock Report</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h2 { color: #dc2626; }
            ul { list-style: disc; padding-left: 20px; }
            li { margin-bottom: 6px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div id="print-content">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Low Stock Products</h2>
          <ul className="list-disc ml-5 mb-4">
            {products.length > 0 ? (
              products.map((item) => (
                <li key={item._id}>
                  {item.name} - {item.quantity} {item.unit}
                </li>
              ))
            ) : (
              <li>No low stock products.</li>
            )}
          </ul>

          <h2 className="text-lg font-semibold text-red-600 mb-2">Low Stock Raw Materials</h2>
          <ul className="list-disc ml-5">
            {rawMaterials.length > 0 ? (
              rawMaterials.map((item) => (
                <li key={item._id}>
                  {item.name} - {item.quantity} {item.unit}
                </li>
              ))
            ) : (
              <li>No low stock raw materials.</li>
            )}
          </ul>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={handlePrint}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Print Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintLowStockModal;