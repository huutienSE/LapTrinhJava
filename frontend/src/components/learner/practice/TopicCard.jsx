import { Link } from "react-router-dom";
import { formatLevel } from "../../../utils/assessmentLevels.js";

const levelStyles = {
  BEGINNER: "bg-green-500/10 text-green-400 border-green-500/30",
  INTERMEDIATE: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  ADVANCED: "bg-red-500/10 text-red-400 border-red-500/30",
};

const TopicCard = ({ topic }) => {
  const levelKey = String(topic.difficultyLevel || "").toUpperCase();
  const badgeClass =
    levelStyles[levelKey] ?? "bg-zinc-800 text-zinc-400 border-zinc-700";

  return (
    <Link
      to={`/practice/${topic.topicId}`}
      className="group block p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800/80 hover:border-indigo-500/30 transition-all hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
          {topic.topicName}
        </h3>
        <span
          className={`shrink-0 text-xs px-2 py-1 rounded-md border ${badgeClass}`}
        >
          {formatLevel(topic.difficultyLevel)}
        </span>
      </div>
      <p className="text-sm text-zinc-500 line-clamp-2">
        {topic.description || "Chưa có mô tả."}
      </p>
    </Link>
  );
};

export default TopicCard;
