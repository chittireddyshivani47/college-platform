interface Props {
  children: React.ReactNode;
  variant?: "blue" | "green" | "yellow" | "red" | "gray" | "purple";
  size?: "sm" | "md";
}

const variants = {
  blue:   "bg-blue-50 text-blue-700 border-blue-100",
  green:  "bg-green-50 text-green-700 border-green-100",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
  red:    "bg-red-50 text-red-700 border-red-100",
  gray:   "bg-gray-50 text-gray-700 border-gray-200",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
};

const sizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
};

export default function Badge({ children, variant = "blue", size = "sm" }: Props) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
