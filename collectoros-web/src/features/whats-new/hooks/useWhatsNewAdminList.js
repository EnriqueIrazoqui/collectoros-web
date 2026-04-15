import { useQuery } from "@tanstack/react-query";
import { getWhatsNewAdminListRequest } from "../api/whatsNewApi";

function useWhatsNewAdminList() {
  return useQuery({
    queryKey: ["whats-new-admin-list"],
    queryFn: getWhatsNewAdminListRequest,
    refetchOnWindowFocus: false,
  });
}

export { useWhatsNewAdminList };