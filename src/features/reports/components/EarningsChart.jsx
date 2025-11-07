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
  // Format data with day and date for tooltip display
  const dayMap = ["S", "M", "T", "W", "T", "F", "S"];
  const formattedData = data.map((entry, index) => ({
    day: dayMap[index % 7],
    earnings: entry.earnings || 0,
    date: entry.date || "", // expect backend to include a "date" field
  }));

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
            formatter={(val, name, props) => [`₱${val.toFixed(2)}`, "Earnings"]}
            labelFormatter={(label, payload) => {
              const item = payload && payload[0]?.payload;
              return item ? item.date : label; // show full date on hover
            }}
          />
          <Bar
            dataKey="earnings"
            fill="#10b981"
            radius={[6, 6, 0, 0]} // rounded top corners
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;