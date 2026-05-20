const STORAGE_KEY = "learnerProfile";

export function getStoredProfileId() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.profileId ?? null;
  } catch {
    return null;
  }
}

export function saveStoredProfile(profile) {
  if (!profile?.profileId) return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      profileId: profile.profileId,
      firstName: profile.firstName,
      lastName: profile.lastName,
    })
  );
}

export function clearStoredProfile() {
  localStorage.removeItem(STORAGE_KEY);
}
