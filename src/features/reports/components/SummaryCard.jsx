import { TrendingDown, TrendingUp } from "lucide-react";

const SummaryCard = ({ label, value, previousValue, change, icon }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-3xl p-5 flex gap-5 items-center h-full">
      {/* Main Icon */}
      {icon}

      {/* Text Content */}
      <div>
        <h3 className="text-sm text-gray-600">{label}</h3>
        <p className="text-2xl font-bold">{value}</p>

        <div className="flex items-center gap-1 text-sm">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-[#FA6501]" />
          ) : (
            <TrendingDown className="w-4 h-4 text-[#B76FBA]" />
          )}
          <span
            className={
              isPositive ? "text-[#FA6501]" : "text-[#B76FBA]"
            }
          >
            {Math.abs(change)?.toFixed(2)}%
          </span>
          <span className="ml-1 text-gray-500">vs {previousValue}</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;