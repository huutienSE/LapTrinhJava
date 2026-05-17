import { useState, useCallback } from "react";
import { assessmentService } from "../services/api.jsx";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  "Đã xảy ra lỗi. Vui lòng thử lại sau.";

export function useAssessmentSession() {
  const [view, setView] = useState("intro");
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerResult, setAnswerResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setView("intro");
    setSessionId(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswerResult(null);
    setFinalResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const start = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await assessmentService.start();
      if (!response.success) {
        setError(response.message || "Không thể bắt đầu bài đánh giá.");
        return;
      }
      const { sessionId: id, questions: list } = response.data ?? {};
      if (!id || !list?.length) {
        setError("Không đủ câu hỏi để bắt đầu bài đánh giá.");
        return;
      }
      setSessionId(id);
      setQuestions(list);
      setCurrentIndex(0);
      setAnswerResult(null);
      setFinalResult(null);
      setView("question");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(
    async (answerText) => {
      const question = questions[currentIndex];
      if (!sessionId || !question) return false;

      setIsLoading(true);
      setError(null);
      try {
        const response = await assessmentService.submitAnswer(sessionId, {
          questionId: question.questionId,
          answer: answerText.trim(),
        });
        if (!response.success) {
          setError(response.message || "Không thể nộp câu trả lời.");
          return false;
        }
        setAnswerResult(response.data);
        setView("feedback");
        return true;
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, questions, currentIndex]
  );

  const commit = useCallback(async () => {
    if (!sessionId) return false;

    setIsLoading(true);
    setError(null);
    try {
      const response = await assessmentService.commit({ sessionId });
      if (!response.success) {
        setError(response.message || "Không thể hoàn tất bài đánh giá.");
        return false;
      }
      setFinalResult(response.data);
      setView("final");
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const advanceAfterFeedback = useCallback(async () => {
    const isLast = currentIndex >= questions.length - 1;
    if (isLast) {
      await commit();
      return;
    }
    setAnswerResult(null);
    setCurrentIndex((i) => i + 1);
    setView("question");
  }, [currentIndex, questions.length, commit]);

  const currentQuestion = questions[currentIndex] ?? null;
  const totalQuestions = questions.length;
  const isLastQuestion =
    totalQuestions > 0 && currentIndex === totalQuestions - 1;

  return {
    view,
    sessionId,
    questions,
    currentIndex,
    currentQuestion,
    totalQuestions,
    isLastQuestion,
    answerResult,
    finalResult,
    isLoading,
    error,
    setError,
    start,
    submitAnswer,
    advanceAfterFeedback,
    reset,
  };
}
