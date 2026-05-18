import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { profileService } from "../../services";
import {
  saveStoredProfile,
  clearStoredProfile,
} from "../../utils/learnerProfileStorage.js";
import ProfileForm from "../../components/learner/profile/ProfileForm.jsx";
import { PageLoading } from "../../components/learner/layout/PageStates.jsx";
import AssessmentTestTab from "../../components/learner/assessment/AssessmentTestTab.jsx";
import AssessmentHistoryTab from "../../components/learner/assessment/AssessmentHistoryTab.jsx";

const TABS = [
  { id: "test", label: "Làm bài" },
  { id: "history", label: "Lịch sử" },
];

const Assessment = () => {
  const [tab, setTab] = useState("test");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasProfile = Boolean(profile?.profileId);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const response = await profileService.getMe();
      if (response.success && response.data) {
        setProfile(response.data);
        saveStoredProfile(response.data);
      } else {
        setProfile(null);
        clearStoredProfile();
      }
    } catch (err) {
      setProfile(null);
      if (err.response?.status === 404) {
        clearStoredProfile();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!hasProfile) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white">Đánh giá trình độ</h2>
          <p className="text-zinc-500 mt-2">
            Bạn cần tạo hồ sơ trước khi bắt đầu bài đánh giá.
          </p>
        </header>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 text-amber-200 text-sm">
          Hồ sơ giúp hệ thống lưu trình độ sau khi hoàn thành bài đánh giá.
        </div>

        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8">
          <ProfileForm
            mode="create"
            submitLabel="Tạo hồ sơ và tiếp tục"
            onSuccess={(response) => {
              if (response?.success && response.data) {
                setProfile(response.data);
                saveStoredProfile(response.data);
              }
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
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-white">Đánh giá trình độ</h2>
        <p className="text-zinc-500 mt-2">
          Làm bài kiểm tra và xem lại lịch sử đánh giá tại đây.
        </p>
      </header>

      <div className="flex gap-2 mb-8 p-1 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === id
                ? "bg-indigo-500 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "test" ? <AssessmentTestTab /> : <AssessmentHistoryTab />}
    </div>
  );
};

export default Assessment;
