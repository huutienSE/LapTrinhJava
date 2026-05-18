import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { profileService } from "../../services";
import { getHttpAwareErrorMessage } from "../../utils/apiError.js";
import {
  saveStoredProfile,
  clearStoredProfile,
} from "../../utils/learnerProfileStorage.js";
import ProfileForm from "../../components/learner/profile/ProfileForm.jsx";
import {
  PageLoading,
  PageError,
} from "../../components/learner/layout/PageStates.jsx";
import ActionButton from "../../components/common/ActionButton.jsx";

const Profile = () => {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const hasProfile = Boolean(profile?.profileId);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
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
      } else {
        setError(
          getHttpAwareErrorMessage(err, "Không thể tải hồ sơ người dùng")
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSuccess = (response) => {
    if (response?.success && response.data) {
      setProfile(response.data);
      saveStoredProfile(response.data);
    }
    setIsEditing(false);
    if (returnTo) {
      window.location.href = returnTo;
    }
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (error && !hasProfile) {
    return <PageError message={error} onRetry={loadProfile} />;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white">Hồ sơ của bạn</h2>
        <p className="text-zinc-500 mt-2">
          Thông tin cá nhân dùng cho đánh giá trình độ và luyện tập.
        </p>
      </header>

      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8">
        {!hasProfile || isEditing ? (
          <>
            <p className="text-zinc-400 text-sm mb-6">
              {hasProfile
                ? "Cập nhật thông tin hồ sơ của bạn."
                : "Bạn chưa có hồ sơ. Điền thông tin bên dưới để tạo mới."}
            </p>
            <ProfileForm
              mode={hasProfile ? "edit" : "create"}
              initialProfile={profile}
              onSuccess={handleSuccess}
            />
            {hasProfile && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="mt-4 text-sm text-zinc-500 hover:text-zinc-300"
              >
                Hủy chỉnh sửa
              </button>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {[profile.firstName, profile.lastName]
                    .filter(Boolean)
                    .join(" ") || "Chưa đặt tên"}
                </h3>
                {profile.level && profile.level !== "null" && (
                  <span className="text-xs px-2 py-1 mt-1 inline-block rounded-md bg-indigo-500/20 text-indigo-400">
                    {profile.level}
                  </span>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-zinc-500 mb-1">Ngày sinh</dt>
                <dd className="text-zinc-200">
                  {profile.birthDate
                    ? new Date(profile.birthDate).toLocaleDateString("vi-VN")
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500 mb-1">Nghề nghiệp</dt>
                <dd className="text-zinc-200">{profile.occupation || "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-zinc-500 mb-1">Mục tiêu</dt>
                <dd className="text-zinc-200">{profile.targetGoal || "—"}</dd>
              </div>
            </dl>

            <ActionButton
              variant="primary"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa hồ sơ
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
