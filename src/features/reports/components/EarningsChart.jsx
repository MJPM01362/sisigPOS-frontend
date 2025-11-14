import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EarningsChart = ({ data }) => {
  const formattedData = data.map((entry) => {
    const dateObj = new Date(entry.date);
    const day = dateObj.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
    return {
      day,
      earnings: entry.earnings || 0,
      date: entry.date || "",
    };
  });

  return (
    <div className="bg-white rounded-2xl shadow p-4 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Weekly Earnings
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(val) => `₱${val}`} />
          <Tooltip
            formatter={(val) => [`₱${val.toFixed(2)}`, "Earnings"]}
            labelFormatter={(label, payload) => {
              const item = payload && payload[0]?.payload;
              return item ? item.date : label;
            }}
          />
          <Bar
            dataKey="earnings"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;