const TIER_CLASSES = {
  high: "bg-green-500/20 text-green-400",
  mid: "bg-orange-500/20 text-orange-400",
  low: "bg-red-500/20 text-red-400",
};

const VARIANT_CLASSES = {
  tier: (score) => {
    if (score >= 80) return TIER_CLASSES.high;
    if (score >= 50) return TIER_CLASSES.mid;
    return TIER_CLASSES.low;
  },
  success: () => "bg-green-500/20 text-green-400",
  highlight: () => "bg-indigo-500/20 text-indigo-400",
};

const SIZE_CLASSES = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
};

const ScoreBadge = ({
  score,
  variant = "tier",
  size = "sm",
  suffix = "",
  className = "",
}) => {
  const numericScore = score ?? 0;
  const colorClass =
    typeof VARIANT_CLASSES[variant] === "function"
      ? VARIANT_CLASSES[variant](numericScore)
      : VARIANT_CLASSES.tier(numericScore);

  return (
    <span
      className={`inline-block rounded-full font-bold ${SIZE_CLASSES[size]} ${colorClass} ${className}`.trim()}
    >
      {numericScore}
      {suffix}
    </span>
  );
};

export default ScoreBadge;
