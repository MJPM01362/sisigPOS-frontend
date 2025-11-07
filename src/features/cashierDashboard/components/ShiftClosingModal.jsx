const ShiftClosingModal = async () => {
  try {
    const res = await api.post("/shifts/end", {
      totalSales: todaySales?.totalSales || 0,
      totalOrders: todaySales?.totalOrders || 0,
      cash: todaySales?.cash || 0,
      gcash: todaySales?.gcash || 0,
      notes: "Shift ended via dashboard",
    });

    toast.success("Shift ended successfully!");
    setActiveShift(null);
    setShowShiftModal(false);
  } catch (err) {
    toast.error("Failed to end shift");
    console.error("End shift error:", err);
  }
};

export default ShiftClosingModal;