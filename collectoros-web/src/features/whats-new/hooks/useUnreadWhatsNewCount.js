import { useMemo } from "react";
import { useWhatsNewList } from "./useWhatsNewList";

function useUnreadWhatsNewCount() {
  const whatsNewQuery = useWhatsNewList();

  const unreadCount = useMemo(() => {
    const items = whatsNewQuery.data?.data || [];
    return items.filter((item) => !item.isViewed).length;
  }, [whatsNewQuery.data]);

  return {
    ...whatsNewQuery,
    unreadCount,
  };
}

export { useUnreadWhatsNewCount };