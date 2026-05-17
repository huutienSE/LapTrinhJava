export const LEVEL_LABELS = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export const formatLevel = (level) => {
  if (!level) return "—";
  const key = String(level).toUpperCase();
  return LEVEL_LABELS[key] ?? level;
};
