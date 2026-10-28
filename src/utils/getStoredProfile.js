export default function getStoredProfile() {
  const storedProfile = localStorage.getItem("profile");
  if (!storedProfile) return null;

  try {
    return JSON.parse(storedProfile);
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}
