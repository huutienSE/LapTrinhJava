import { Link } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile.js";
import ProfileForm from "../../components/learner/profile/ProfileForm.jsx";
import { PageLoading } from "../../components/learner/layout/PageStates.jsx";
import AssessmentActiveTest from "../../components/learner/assessment/AssessmentActiveTest.jsx";

const Assessment = () => {
  const { hasProfile, isLoading, setProfileFromResponse, reload } = useProfile();

  if (isLoading) {
    return <PageLoading />;
  }

  if (!hasProfile) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white">Đánh giá trình độ</h2>
          <p className="text-zinc-500 mt-2">
            Bạn cần tạo hồ sơ trước khi bắt đầu và nộp bài đánh giá.
          </p>
        </header>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 text-amber-200 text-sm">
          Hồ sơ giúp hệ thống lưu trình độ sau khi bạn hoàn thành bài đánh giá
          đầu vào.
        </div>

        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Tạo hồ sơ ngay
          </h3>
          <ProfileForm
            mode="create"
            submitLabel="Tạo hồ sơ và tiếp tục"
            onSuccess={(response) => {
              setProfileFromResponse(response);
              reload();
            }}
          />
          <p className="text-zinc-500 text-sm mt-4 text-center">
            Hoặc{" "}
            <Link to="/profile" className="text-indigo-400 hover:text-indigo-300">
              mở trang Hồ sơ
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white">Đánh giá trình độ</h2>
        <p className="text-zinc-500 mt-2">
          Bài kiểm tra đầu vào gồm 10 câu hỏi ngẫu nhiên. Trả lời bằng giọng nói
          và xem nhận xét sau từng câu.
        </p>
      </header>

      <AssessmentActiveTest />
    </div>
  );
};

export default Assessment;
