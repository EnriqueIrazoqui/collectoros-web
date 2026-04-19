import { useQuery } from "@tanstack/react-query";
import { getWhatsNewListRequest } from "../api/whatsNewApi";

function useWhatsNewList() {
  return useQuery({
    queryKey: ["whats-new-list"],
    queryFn: getWhatsNewListRequest,
    refetchOnWindowFocus: false,
  });
}

export { useWhatsNewList };