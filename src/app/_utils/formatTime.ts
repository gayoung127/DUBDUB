export const formatTime = (seconds: number, mode?: "marker") => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 100);

  if (mode === "marker") {
    return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(millis).padStart(2, "0")}`;
};
