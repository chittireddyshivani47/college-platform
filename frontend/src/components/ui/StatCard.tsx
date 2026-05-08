interface Props {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "gray";
}

const colors = {
  blue:   "text-blue-600 bg-blue-50",
  green:  "text-green-600 bg-green-50",
  yellow: "text-yellow-600 bg-yellow-50",
  red:    "text-red-600 bg-red-50",
  gray:   "text-gray-600 bg-gray-50",
};

export default function StatCard({ label, value, icon, color = "blue" }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
      {icon && (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-xl font-bold ${colors[color].split(" ")[0]}`}>{value}</p>
      </div>
    </div>
  );
}
