const RawMaterialTable = ({ materials, onEdit, onDelete }) => {
  return (
    <table className="w-full table-auto border-collapse">
      <thead className="bg-gray-100 text-sm font-medium text-gray-700">
        <tr>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Quantity</th>
          <th className="p-2 border">Unit</th>
          <th className="p-2 border">Cost / Unit (₱)</th>
          <th className="p-2 border">Total Cost (₱)</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {materials.map((mat) => (
          <tr key={mat._id} className="text-sm hover:bg-gray-50">
            <td className="p-2 border">{mat.name}</td>
            <td className="p-2 border text-center">{mat.quantity}</td>
            <td className="p-2 border text-center">{mat.unit}</td>
            <td className="p-2 border text-center">
              {mat.costPerUnit ? mat.costPerUnit.toFixed(2) : "—"}
            </td>
            <td className="p-2 border text-center">
              {mat.totalCost
                ? mat.totalCost.toFixed(2)
                : mat.costPerUnit && mat.quantity
                ? (mat.costPerUnit * mat.quantity).toFixed(2)
                : "—"}
            </td>
            <td className="p-2 border text-center">
              <button
                onClick={() => onEdit(mat)}
                className="text-blue-500 text-xs mr-2 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(mat._id)}
                className="text-red-500 text-xs hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RawMaterialTable;