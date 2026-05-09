import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { userService } from "../services/api";

const SessionDetail = () => {

    const { sessionId } = useParams();

    const [session, setSession] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const fetchSessionDetail = async () => {

            try {

                const response =
                    await userService.getPracticeHistoryDetail(sessionId);

                if (response.success) {
                    setSession(response.data);
                }

            } catch (error) {

                console.error(
                    "Lỗi lấy session detail:",
                    error
                );

            } finally {

                setIsLoading(false);
            }
        };

        fetchSessionDetail();

    }, [sessionId]);

    if (isLoading) {
        return (
            <div className="text-center py-20 text-zinc-500">
                Đang tải dữ liệu...
            </div>
        );
    }

    if (!session) {
        return (
            <div className="text-center py-20 text-red-400">
                Không tìm thấy session
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8">

            <div className="mb-8">

                <Link
                    to="/history"
                    className="
                        text-indigo-400
                        hover:text-indigo-300
                        text-sm
                    "
                >
                    ← Quay lại lịch sử
                </Link>

                <h1 className="text-3xl font-bold text-white mt-4">
                    {session.topicName}
                </h1>

                <p className="text-zinc-500 mt-2">
                    Session ID: {session.sessionId}
                </p>

                <div className="mt-4">
                    <span className="
                        px-4 py-2 rounded-full
                        bg-indigo-500/20
                        text-indigo-400
                        font-bold
                    ">
                        Tổng điểm: {session.score}
                    </span>
                </div>
            </div>

            <div className="space-y-6">

                {session.questions.map((question, index) => (

                    <div
                        key={question.questionId}
                        className="
                            bg-zinc-900/50
                            border
                            border-zinc-800
                            rounded-2xl
                            p-6
                        "
                    >

                        <div className="flex items-center justify-between mb-4">

                            <h2 className="text-lg font-semibold text-white">
                                Câu {index + 1}
                            </h2>

                            <span className="
                                px-3 py-1 rounded-full text-sm font-bold
                                bg-green-500/20 text-green-400
                            ">
                                {question.score} điểm
                            </span>
                        </div>

                        <div className="space-y-4">

                            <div>
                                <p className="text-zinc-500 text-sm mb-1">
                                    Câu hỏi
                                </p>

                                <p className="text-white">
                                    {question.question}
                                </p>
                            </div>

                            <div>
                                <p className="text-zinc-500 text-sm mb-1">
                                    Câu trả lời của bạn
                                </p>

                                <p className="text-zinc-300">
                                    {question.userAnswer}
                                </p>
                            </div>

                            <div>
                                <p className="text-zinc-500 text-sm mb-1">
                                    Feedback
                                </p>

                                <p className="text-indigo-300">
                                    {question.feedback}
                                </p>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionDetail;