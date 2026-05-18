import { useState } from "react";
import { profileService } from "../../../services/api.jsx";
import { fieldErrorClass, getApiErrorMessage, parseApiError } from "../../../utils/apiError.js";

const LEVEL_OPTIONS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

const emptyForm = {
  firstName: "",
  lastName: "",
  birthDate: "",
  targetGoal: "",
  occupation: "",
  level: "",
};

const ProfileForm = ({
  mode = "create",
  initialProfile = null,
  onSuccess,
  submitLabel,
}) => {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    firstName: initialProfile?.firstName ?? "",
    lastName: initialProfile?.lastName ?? "",
    birthDate: initialProfile?.birthDate ?? "",
    targetGoal: initialProfile?.targetGoal ?? "",
    occupation: initialProfile?.occupation ?? "",
    level: initialProfile?.level ?? "",
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setFieldErrors({});

    const payload = {
      firstName: form.firstName.trim() || null,
      lastName: form.lastName.trim() || null,
      birthDate: form.birthDate || null,
      targetGoal: form.targetGoal.trim() || null,
      occupation: form.occupation.trim() || null,
    };

    if (mode === "edit") {
      payload.level = form.level || null;
    }

    try {
      const response =
        mode === "create"
          ? await profileService.create(payload)
          : await profileService.update(initialProfile.profileId, payload);

      if (response.success) {
        onSuccess?.(response);
      } else {
        setError(response.message || "Không thể lưu hồ sơ");
      }
    } catch (err) {
      const { formError, fieldErrors: errors } = parseApiError(err);
      setFieldErrors(errors || {});
      setError(formError || (errors ? "" : getApiErrorMessage(err, "Không thể lưu hồ sơ")));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Họ</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Nguyễn"
          />
          {fieldErrors.firstName && (
            <p className={fieldErrorClass}>{fieldErrors.firstName}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Tên</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Văn A"
          />
          {fieldErrors.lastName && (
            <p className={fieldErrorClass}>{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-zinc-400">Ngày sinh</label>
        <input
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          className={inputClass}
        />
        {fieldErrors.birthDate && (
          <p className={fieldErrorClass}>{fieldErrors.birthDate}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm text-zinc-400">Mục tiêu học tập</label>
        <input
          name="targetGoal"
          value={form.targetGoal}
          onChange={handleChange}
          className={inputClass}
          placeholder="Ví dụ: IELTS 6.5, giao tiếp công việc"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-zinc-400">Nghề nghiệp</label>
        <input
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          className={inputClass}
          placeholder="Sinh viên, kỹ sư..."
        />
      </div>

      {mode === "edit" && (
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Trình độ (sau đánh giá)</label>
          <select
            name="level"
            value={form.level || ""}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Chưa xác định</option>
            {LEVEL_OPTIONS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <p className="text-xs text-zinc-500">
            Trình độ thường được cập nhật sau bài đánh giá đầu vào.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-5 py-3 text-base font-semibold rounded-xl bg-indigo-500 text-white border border-indigo-500 hover:bg-indigo-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? "Đang lưu..."
          : submitLabel || (mode === "create" ? "Tạo hồ sơ" : "Cập nhật hồ sơ")}
      </button>
    </form>
  );
};

export default ProfileForm;
