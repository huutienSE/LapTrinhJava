import { useCallback, useEffect, useState } from "react";
import { profileService } from "../services/api.jsx";
import {
  getStoredProfileId,
  saveStoredProfile,
  clearStoredProfile,
} from "../utils/learnerProfileStorage";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const profileId = getStoredProfileId();
    if (!profileId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await profileService.getById(profileId);
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
          err.response?.data?.message || "Không thể tải hồ sơ người dùng"
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const setProfileFromResponse = useCallback((response) => {
    if (response?.success && response.data) {
      setProfile(response.data);
      saveStoredProfile(response.data);
    }
  }, []);

  return {
    profile,
    hasProfile: Boolean(profile?.profileId),
    isLoading,
    error,
    reload: loadProfile,
    setProfileFromResponse,
  };
}
