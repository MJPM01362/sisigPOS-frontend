import { useRef } from "react";
import ReceiptPreview from "../../pos/components/ReceiptPreview";

const ReceiptModal = ({ order, onClose }) => {
  const receiptRef = useRef(null);

  const subtotal = order.items.reduce(
    (sum, item) => sum + (item?.product?.price || 0) * item.quantity,
    0
  );
  const vatAmount = subtotal * 0.12;
  const tipAmount = Number(order.tip || 0);
  const total = subtotal + vatAmount + tipAmount;

  const cashPaid =
    order.cashPaid !== undefined && order.cashPaid !== null
      ? Number(order.cashPaid)
      : 0;
  const change =
    order.change !== undefined && order.change !== null
      ? Number(order.change)
      : cashPaid > total
      ? Number((cashPaid - total).toFixed(2))
      : 0;

  const handlePrint = () => {
    if (!receiptRef.current) return;

    const printContent = receiptRef.current.outerHTML;
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "absolute";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @media print {
              body {
                font-family: monospace;
                margin: 0;
                padding: 15px;
                background: white;
                color: black;
              }

              .receipt-container {
                width: 300px;
                margin: 0 auto;
                font-size: 13px;
                line-height: 1.4;
              }

              h2 {
                font-size: 18px;
                text-align: center;
                font-weight: bold;
                margin-bottom: 8px;
              }

              p {
                margin: 2px 0;
              }

              .order-type {
                text-align: center;
                font-weight: bold;
                font-size: 12px;
                text-transform: uppercase;
                margin-bottom: 4px;
              }

              .line {
                display: flex;
                justify-content: space-between;
                padding: 2px 0;
                white-space: nowrap;
              }

              .line span.name {
                flex: 1;
              }

              .line span.amount {
                width: 80px;
                text-align: right;
              }

              .border-t {
                border-top: 1px dashed black;
                margin-top: 5px;
                padding-top: 5px;
              }

              .totals {
                font-weight: bold;
                font-size: 14px;
                margin-top: 5px;
              }

              .section {
                margin-top: 5px;
                padding-top: 2px;
                padding-bottom: 2px;
              }

              .gcash-ref {
                text-align: center;
                font-size: 12px;
                margin-top: 5px;
              }

              .thank-you {
                text-align: center;
                font-size: 11px;
                margin-top: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <h2>SisigPOS</h2>
            <p class="text-center">${new Date(order.createdAt).toLocaleString()}</p>
            <p class="text-center text-xs">Order ID: ${order._id}</p>
            ${
              order.orderType
                ? `<p class="order-type">${order.orderType}</p>` // ✅ Show order type
                : ""
            }

            <div class="border-t section">
              ${order.items
                .map(
                  (item) =>
                    `<div class="line">
                      <span class="name">${item.product?.name || item.name} x${item.quantity}</span>
                      <span class="amount">₱${((item.product?.price || item.price) * item.quantity).toFixed(2)}</span>
                    </div>`
                )
                .join("")}
            </div>

            <div class="section">
              <div class="line">
                <span>Subtotal</span>
                <span>₱${subtotal.toFixed(2)}</span>
              </div>
              <div class="line">
                <span>VAT (12%)</span>
                <span>₱${vatAmount.toFixed(2)}</span>
              </div>
              <div class="line">
                <span>Tip</span>
                <span>₱${tipAmount.toFixed(2)}</span>
              </div>
              <div class="line totals border-t">
                <span>Total</span>
                <span>₱${total.toFixed(2)}</span>
              </div>

              ${
                order.paymentMethod === "Cash"
                  ? `
                <div class="line">
                  <span>Cash Paid</span>
                  <span>₱${cashPaid.toFixed(2)}</span>
                </div>
                <div class="line totals">
                  <span>Change</span>
                  <span>₱${change.toFixed(2)}</span>
                </div>
              `
                  : ""
              }

              ${
                order.paymentMethod === "GCash" && order.gcashCode
                  ? `
                <div class="gcash-ref">
                  <strong>GCash Ref#:</strong> ${order.gcashCode}
                </div>
              `
                  : ""
              }
            </div>

            <p class="thank-you">Thank you for ordering!</p>
          </div>
        </body>
      </html>
    `);
    frameDoc.close();

    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();

    setTimeout(() => document.body.removeChild(printFrame), 500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[340px] text-sm">
        <ReceiptPreview
          ref={receiptRef}
          items={order.items}
          totalAmount={Number(total.toFixed(2))}
          tip={Number(tipAmount.toFixed(2))}
          paymentMethod={order.paymentMethod}
          gcashCode={order.gcashCode}
          cashPaid={Number(cashPaid.toFixed(2))}
          change={Number(change.toFixed(2))}
          orderId={order._id}
          date={new Date(order.createdAt).toLocaleString()}
          orderType={order.orderType}
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
