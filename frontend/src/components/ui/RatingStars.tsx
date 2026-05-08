import { Star } from "lucide-react";

interface Props {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
}

export default function RatingStars({ rating, max = 5, size = 14, showValue = true }: Props) {
  const filled = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < filled ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-gray-700 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
