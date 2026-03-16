function formatPriceHistoryCurrency(value) {
  if (value === null || value === undefined || value === "") return "$0.00";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatPriceHistoryDate(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("es-MX", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getLatestPriceHistoryRecord(history = []) {
  if (!Array.isArray(history) || history.length === 0) return null;

  return history.reduce((latest, current) => {
    if (!latest) return current;

    return new Date(current.createdAt) > new Date(latest.createdAt)
      ? current
      : latest;
  }, null);
}

function sortPriceHistoryAsc(history = []) {
  if (!Array.isArray(history)) return [];

  return [...history].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );
}

function sortPriceHistoryDesc(history = []) {
  if (!Array.isArray(history)) return [];

  return [...history].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
}

function transformPriceHistoryForChart(history = []) {
  return sortPriceHistoryAsc(history).map((entry) => ({
    id: entry.id,
    date: new Date(entry.createdAt).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }),
    fullDate: entry.createdAt,
    price: Number(entry.price || 0),
    source: entry.source || "Manual",
  }));
}

export {
  formatPriceHistoryCurrency,
  formatPriceHistoryDate,
  getLatestPriceHistoryRecord,
  sortPriceHistoryAsc,
  sortPriceHistoryDesc,
  transformPriceHistoryForChart,
};