const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api"
    : "https://turbo-system-x9wrjp7v96c97g4-5000.app.github.dev/api");

export const getImageUrl = (image) => {
  if (!image) return "";

  // Base64 image
  if (image.startsWith("data:image")) {
    return image;
  }

  // Already a complete URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // Backend-hosted image
  const serverUrl = API_BASE_URL.replace(/\/api$/, "");

  return `${serverUrl}${
    image.startsWith("/") ? image : `/${image}`
  }`;
};