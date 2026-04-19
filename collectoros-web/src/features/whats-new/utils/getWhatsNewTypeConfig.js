function getWhatsNewTypeConfig(type) {
  const normalized = String(type || "").toLowerCase();

  switch (normalized) {
    case "feature":
      return {
        label: "Feature",
        color: "success",
      };
    case "fix":
      return {
        label: "Fix",
        color: "warning",
      };
    case "announcement":
      return {
        label: "Announcement",
        color: "info",
      };
    default:
      return {
        label: "Improvement",
        color: "default",
      };
  }
}

export default getWhatsNewTypeConfig;