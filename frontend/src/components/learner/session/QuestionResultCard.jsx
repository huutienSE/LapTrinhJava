import ScoreBadge from "./ScoreBadge.jsx";

const QuestionResultCard = ({ index, question }) => (
  <article className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
    <header className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-white">Câu {index + 1}</h2>
      <ScoreBadge score={question.score} variant="success" suffix=" điểm" />
    </header>

    <div className="space-y-4">
      <section>
        <p className="text-zinc-500 text-sm mb-1">Câu hỏi</p>
        <p className="text-white">{question.question}</p>
      </section>

      <section>
        <p className="text-zinc-500 text-sm mb-1">Câu trả lời của bạn</p>
        <p className="text-zinc-300">{question.userAnswer || "—"}</p>
      </section>

      <section>
        <p className="text-zinc-500 text-sm mb-1">Feedback</p>
        <p className="text-indigo-300">{question.feedback || "—"}</p>
      </section>
    </div>
  </article>
);

export default QuestionResultCard;
