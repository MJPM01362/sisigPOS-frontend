import { forwardRef } from "react";

const ReceiptPreview = forwardRef(
  (
    {
      items = [],
      cart = [],
      totalAmount,
      date,
      orderId,
      paymentMethod,
      gcashCode,
      tip = 0,
      cashPaid = 0,
      orderType, // ✅ added
    },
    ref
  ) => {
    const currentDate = date || new Date().toLocaleString();
    const data = cart.length > 0 ? cart : items;

    const subtotal = data.reduce((sum, item) => {
      const unitPrice = item.option?.price ?? item.product?.price ?? item.price ?? 0;
      return sum + unitPrice * item.quantity;
    }, 0);

    const vat = subtotal * 0.12;
    const finalTotal = subtotal + tip;
    const change =
      paymentMethod === "Cash" ? Math.max(cashPaid - finalTotal, 0) : 0;

    return (
      <div
        ref={ref}
        className="mx-auto p-4 font-mono text-sm text-black bg-white rounded-lg w-[280px]"
      >
        {/* Header */}
        <h2 className="text-center text-lg font-bold mb-2">SisigPOS</h2>
        <p className="text-center mb-1">{currentDate}</p>
        {orderId && (
          <p className="text-center mb-1 text-xs">Order ID: {orderId}</p>
        )}

        {/* ✅ Order Type */}
        {orderType && (
          <p className="text-center text-xs font-semibold uppercase mb-2">
            {orderType}
          </p>
        )}

        {/* Items */}
        <div className="border-t border-b py-2 space-y-1">
          {data.length === 0 ? (
            <p className="text-center text-gray-500">No items in receipt.</p>
          ) : (
            data.map((item, index) => {
              const unitPrice =
                item.option?.price ?? item.product?.price ?? item.price ?? 0;
              return (
                <div key={index} className="flex justify-between">
                  <span className="truncate">
                    {item.product?.name || item.name} x{item.quantity}
                    {item.option && (
                      <span className="block text-xs text-gray-500">
                        Option: {item.option.label}
                      </span>
                    )}
                  </span>
                  <span>₱{(unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Totals */}
        <div className="mt-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT (12%)</span>
            <span>₱{vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tip</span>
            <span>₱{tip.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Total</span>
            <span>₱{finalTotal.toFixed(2)}</span>
          </div>

          {paymentMethod === "Cash" && (
            <>
              <div className="flex justify-between">
                <span>Cash Paid</span>
                <span>₱{cashPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Change</span>
                <span>₱{change.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* GCash Reference */}
        {paymentMethod === "GCash" && gcashCode && (
          <div className="mt-2 text-sm text-gray-700 text-center">
            <span className="font-semibold">GCash Ref#:</span> {gcashCode}
          </div>
        )}

        {/* Footer */}
        <p className="text-center mt-4 text-xs text-gray-600">
          Thank you for ordering!
        </p>
      </div>
    );
  }
);

export default ReceiptPreview;