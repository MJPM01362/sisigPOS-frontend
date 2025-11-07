import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SalesTrendChart = ({ data }) => {
  return (
    <section className="relative bg-white rounded-xl shadow h-full p-3 flex flex-col">
      <h3 className="text-base font-semibold text-gray-800 mb-2">
        Sales Trend
      </h3>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="date"
              stroke="#94A3B8"
              fontSize={11}
              tickMargin={4}
              height={20}
            />
            <YAxis stroke="#94A3B8" fontSize={11} width={35} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "0.5rem",
                border: "1px solid #E2E8F0",
                fontSize: "12px",
              }}
            />
            <Legend
              verticalAlign="top"
              height={24}
              iconSize={8}
              wrapperStyle={{ fontSize: "12px", marginBottom: "-8px" }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#FA6501"
              strokeWidth={2}
              dot={false}
              name="Revenue (₱)"
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#2563EB"
              strokeWidth={1.8}
              dot={false}
              name="Orders"
            />
            <Line
              type="monotone"
              dataKey="items"
              stroke="#10B981"
              strokeWidth={1.8}
              dot={false}
              name="Items Sold"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default SalesTrendChart;